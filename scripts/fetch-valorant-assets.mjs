// One-off asset sync for the /register agent picker.
//   node scripts/fetch-valorant-assets.mjs
// Agent art/metadata: https://valorant-api.com (images stay hotlinked to its CDN).
// Voice lines: https://huggingface.co/datasets/NgThVinh/ValorantAgentVoiceLines
// The parquet files are 50-90 MB each, so we range-read only the name/transcript
// columns plus the row group holding the picked clips, then transcode to small mp3s.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { asyncBufferFromUrl, cachedAsyncBuffer, parquetMetadataAsync, parquetReadObjects } from "hyparquet";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VOICE_DIR = join(ROOT, "public", "voices");
const DATA_FILE = join(ROOT, "src", "data", "agents.json");
const TMP_DIR = join(ROOT, "node_modules", ".cache", "valorant-voices");

// Must match VALORANT_CHARACTERS in algozenith-backend/src/schemas/register.ts
const AGENTS = [
  "Brimstone", "Phoenix", "Sage", "Sova", "Viper", "Cypher", "Reyna",
  "Killjoy", "Breach", "Omen", "Jett", "Raze", "Skye", "Yoru", "Astra",
  "KAY/O", "Chamber", "Neon", "Fade", "Harbor", "Gekko", "Deadlock",
  "Iso", "Clove", "Vyse", "Tejo", "Waylay",
];

const PARQUET = (config) =>
  `https://huggingface.co/datasets/NgThVinh/ValorantAgentVoiceLines/resolve/main/${config}/train-00000-of-00001.parquet`;
// Alphabetical rows: these categories mostly live in the first row group, which keeps downloads small.
const LINE_CATEGORIES = ["BarrierDown", "Clutch", "Ace", "Comeback", "MatchStart"];
const LINES_PER_AGENT = 3;
const CONCURRENCY = 3;

const slug = (name) => name.toLowerCase().replace(/[^a-z]/g, "");
const hex = (c) => `#${c.slice(0, 6)}`;

function cleanTranscript(t) {
  return String(t)
    .replace(/\(''[^)]*\)/g, "")
    .replace(/''[^']*''/g, "")
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickLines(agentName, rows, firstGroupRows) {
  const prefix = agentName.replace(/[^A-Za-z]/g, "");
  const picked = [];
  for (const cat of LINE_CATEGORIES) {
    const re = new RegExp(`^${prefix}${cat}\\d*$`, "i");
    const candidates = rows
      .filter((r) => re.test(r.audio_name))
      .map((r) => ({ ...r, text: cleanTranscript(r.transcript) }))
      // Short, punchy, spoken lines only: skip grunts/sfx and translation-heavy ones.
      .filter((r) => r.text.length >= 8 && r.text.length <= 70 && !/''|\(/.test(r.transcript))
      .sort((a, b) => (a.index < firstGroupRows ? 0 : 1) - (b.index < firstGroupRows ? 0 : 1) || Math.abs(a.text.length - 32) - Math.abs(b.text.length - 32));
    const fresh = candidates.find((c) => !picked.some((p) => p.text === c.text));
    if (fresh) picked.push({ ...fresh, category: cat });
    if (picked.length >= LINES_PER_AGENT) break;
  }
  return picked;
}

async function openParquet(config) {
  const head = await fetch(PARQUET(config), { method: "HEAD" });
  if (!head.ok) return null;
  const file = cachedAsyncBuffer(await asyncBufferFromUrl({ url: PARQUET(config) }));
  const metadata = await parquetMetadataAsync(file);
  return { file, metadata };
}

async function fetchVoices(name) {
  const pq = await openParquet(slug(name));
  if (!pq) return [];
  const { file, metadata } = pq;
  const firstGroupRows = Number(metadata.row_groups[0].num_rows);

  const index = await parquetReadObjects({ file, metadata, columns: ["audio_name", "transcript"] });
  const rows = index.map((r, i) => ({ ...r, index: i }));
  const lines = [];

  for (const line of pickLines(name, rows, firstGroupRows)) {
    const fileName = `${line.audio_name.toLowerCase()}.mp3`;
    const dest = join(VOICE_DIR, fileName);
    if (!existsSync(dest)) {
      const [cell] = await parquetReadObjects({ file, metadata, columns: ["audio_file"], rowStart: line.index, rowEnd: line.index + 1, utf8: false });
      const bytes = cell.audio_file?.bytes;
      if (!bytes?.length) continue;
      const tmp = join(TMP_DIR, `${line.audio_name}.wav`);
      writeFileSync(tmp, Buffer.from(bytes));
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-ac", "1", "-ar", "32000", "-b:a", "64k", dest]);
      rmSync(tmp);
    }
    lines.push({ src: `/voices/${fileName}`, text: line.text, kind: line.category });
  }
  return lines;
}

async function main() {
  mkdirSync(VOICE_DIR, { recursive: true });
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  mkdirSync(TMP_DIR, { recursive: true });

  const api = await (await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")).json();
  const byName = new Map(api.data.map((a) => [a.displayName, a]));

  const buildAgent = async (name) => {
    const a = byName.get(name);
    if (!a) throw new Error(`valorant-api has no agent ${name}`);
    const colors = (a.backgroundGradientColors || []).map(hex);
    let voices = [];
    console.log(`… ${name}`);
    try {
      voices = await fetchVoices(name);
    } catch (err) {
      console.warn(`! ${name}: voice fetch failed (${err.message})`);
    }
    console.log(`${name.padEnd(10)} ${a.role.displayName.padEnd(11)} voices=${voices.length}  ${voices.map((l) => l.text).join(" | ")}`);
    return {
      name,
      slug: slug(name),
      role: a.role.displayName,
      roleIcon: a.role.displayIcon,
      description: a.description,
      icon: a.displayIcon,
      portrait: a.fullPortrait,
      background: a.background,
      colors: [colors[0] || "#ff4655", colors[2] || "#0f1923"],
      abilities: a.abilities
        .filter((ab) => ab.slot !== "Passive" && ab.displayIcon)
        .map((ab) => ({ slot: ab.slot, name: ab.displayName, icon: ab.displayIcon })),
      voices,
    };
  };

  const out = new Array(AGENTS.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < AGENTS.length) {
      const i = cursor++;
      out[i] = await buildAgent(AGENTS[i]);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  writeFileSync(DATA_FILE, JSON.stringify(out, null, 2) + "\n");
  console.log(`\nWrote ${out.length} agents -> ${DATA_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
