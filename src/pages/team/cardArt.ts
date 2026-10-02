import { AGENT_BY_NAME, type Agent } from "../register/agents";
import type { PublicTeam } from "../../lib/team";

const INK = "#0f1923";
const INK_2 = "#16222e";
const RED = "#ff4655";
const CREAM = "#ece8e1";
const MUTED = "#8b978f";

const DISPLAY = (px: number) => `700 ${px}px "Tungsten", "Anton", Impact, sans-serif`;
const LABEL = (px: number) => `500 ${px}px "Mark", "Barlow", sans-serif`;
const BODY = (px: number, w = 400) => `${w} ${px}px "Barlow", system-ui, sans-serif`;

/** Card face mesh in card.glb is 0.7164 wide per unit of height; the UV rects are squarer, so faces are drawn at true aspect then squeezed in. */
const FACE_W = 1100;
const FACE_H = 1536;
const ATLAS = 2048;
const FRONT_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

type Ctx = CanvasRenderingContext2D;

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadFonts() {
  if (!document.fonts) return;
  await Promise.all(
    [DISPLAY(100), LABEL(20), BODY(20), BODY(20, 500), BODY(20, 600)].map((f) =>
      document.fonts.load(f).catch(() => undefined),
    ),
  );
}

function spacing(ctx: Ctx, px: number) {
  (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${px}px`;
}

function fitLines(
  ctx: Ctx,
  text: string,
  maxW: number,
  maxLines: number,
  maxSize: number,
  minSize: number,
  maxBlockH = Infinity,
) {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);
  for (let size = maxSize; size >= minSize; size -= 4) {
    ctx.font = DISPLAY(size);
    const lines: string[] = [];
    let cur = "";
    let ok = true;
    for (const w of words) {
      if (ctx.measureText(w).width > maxW) {
        ok = false;
        break;
      }
      const next = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(next).width <= maxW) cur = next;
      else {
        lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
    if (ok && lines.length <= maxLines && lines.length * size * 0.86 <= maxBlockH) return { size, lines };
  }
  ctx.font = DISPLAY(minSize);
  const lines: string[] = [];
  let cur = "";
  for (const ch of text.toUpperCase()) {
    if (ctx.measureText(cur + ch).width > maxW && cur) {
      lines.push(cur.trim());
      cur = ch;
    } else cur += ch;
  }
  if (cur.trim()) lines.push(cur.trim());
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/.$/, "")}…`;
  }
  return { size: minSize, lines };
}

function ellipsize(ctx: Ctx, text: string, maxW: number) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

function grain(ctx: Ctx, w: number, h: number, seed: number, color: string, count: number) {
  const r = rng(seed);
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) ctx.fillRect(r() * w, r() * h, 1.6, 1.6);
}

/** Lanyard clip covers this; drawn so the hole reads as a real punch slot. */
function slot(ctx: Ctx, dark: boolean) {
  const w = 168;
  const h = 30;
  const x = (FACE_W - w) / 2;
  ctx.fillStyle = dark ? "rgba(0,0,0,0.45)" : "rgba(15,25,35,0.14)";
  ctx.beginPath();
  ctx.roundRect(x, 54, w, h, h / 2);
  ctx.fill();
}

function passNo(team: PublicTeam) {
  return `NO. ${String(team.number || 0).padStart(3, "0")}`;
}

function drawFront(
  ctx: Ctx,
  team: PublicTeam,
  agents: (Agent | undefined)[],
  faces: (HTMLImageElement | null)[],
  roleIcons: (HTMLImageElement | null)[],
) {
  const W = FACE_W;
  const H = FACE_H;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#f7f4ef");
  bg.addColorStop(1, "#e7e2d9");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  grain(ctx, W, H, hash(team.slug), "rgba(15,25,35,0.05)", 9000);

  cropMarks(ctx, W, H, "rgba(15,25,35,0.4)");

  const L = 64;
  const TX = 492;
  const TW = W - L - TX;
  const tTop = 150;
  const gap = 16;
  const TH = (H - 184 - tTop - gap * 2) / 3;
  agents.forEach((agent, i) => {
    drawTile(ctx, TX, tTop + i * (TH + gap), TW, TH, i, team.members[i], agent, faces[i], roleIcons[i]);
  });

  slot(ctx, false);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = RED;
  ctx.fillRect(L, 76, 16, 16);
  ctx.fillStyle = INK;
  ctx.font = LABEL(24);
  spacing(ctx, 5);
  ctx.fillText("CODEZILLA 3.0", L + 30, 92);
  ctx.textAlign = "right";
  ctx.fillText(passNo(team), W - L, 92);
  ctx.textAlign = "left";
  ctx.fillRect(L, 122, W - L * 2, 2);

  const colW = TX - L - 36;
  ctx.font = LABEL(18);
  ctx.fillStyle = RED;
  ctx.fillText("SQUAD // TEAM PASS", L, 190);
  spacing(ctx, 0);
  const fit = fitLines(ctx, team.teamName, colW, 4, 150, 60, 470);
  ctx.font = DISPLAY(fit.size);
  ctx.fillStyle = INK;
  const lh = fit.size * 0.86;
  let y = 214 + fit.size * 0.8;
  fit.lines.forEach((line, i) => ctx.fillText(line, L - 3, y + i * lh));
  y += (fit.lines.length - 1) * lh;

  ctx.font = BODY(21);
  ctx.fillStyle = "#56616b";
  ["Three agents. One squad.", "Cleared for Codezilla 3.0,", "the open book codathon."].forEach((t, i) =>
    ctx.fillText(t, L, y + 50 + i * 29),
  );

  const rows: [string, string][] = [
    ["DATE", "5 OCT*"],
    ["VENUE", "LABS, IIIT SONEPAT"],
    ["FORMAT", "OPEN BOOK"],
  ];
  const iy = y + 150;
  rows.forEach(([k, v], i) => {
    const ry = iy + i * 100;
    ctx.fillStyle = "rgba(15,25,35,0.16)";
    ctx.fillRect(L, ry, colW, 2);
    ctx.font = LABEL(15);
    spacing(ctx, 4);
    ctx.fillStyle = MUTED;
    ctx.fillText(k, L, ry + 30);
    spacing(ctx, 0);
    ctx.font = DISPLAY(58);
    ctx.fillStyle = INK;
    ctx.fillText(ellipsize(ctx, v, colW), L, ry + 86);
  });

  const compY = H - 300 - 124 - 112;
  if (iy + 300 + 70 < compY) {
    ctx.font = LABEL(15);
    spacing(ctx, 4);
    ctx.fillStyle = MUTED;
    ctx.fillText("SQUAD COMP", L, compY - 18);
    spacing(ctx, 0);
    agents.forEach((agent, i) => {
      const sx = L + i * 84;
      const g = ctx.createLinearGradient(sx, compY, sx + 72, compY + 72);
      g.addColorStop(0, mix(agent?.colors[0] ?? RED, "#ffffff", 0.2));
      g.addColorStop(1, mix(agent?.colors[0] ?? RED, "#0f1923", 0.5));
      ctx.fillStyle = g;
      ctx.fillRect(sx, compY, 72, 72);
      const icon = roleIcons[i];
      if (icon) ctx.drawImage(icon, sx + 16, compY + 16, 40, 40);
    });
    ctx.font = LABEL(14);
    spacing(ctx, 3);
    ctx.fillStyle = INK;
    ctx.fillText(agents.map((a) => (a?.role ?? "Agent").toUpperCase()).join(" / "), L, compY + 100);
    spacing(ctx, 0);
  }

  ctx.font = DISPLAY(124);
  ctx.fillStyle = RED;
  ctx.fillText("THE SPIKE", L - 3, H - 300);
  ctx.fillText("RUSH.", L - 3, H - 194);

  ctx.fillStyle = INK;
  ctx.fillRect(L, H - 150, W - L * 2, 3);
  ctx.font = LABEL(18);
  spacing(ctx, 4);
  ctx.fillText("TEAM PASS · IIIT SONEPAT", L, H - 104);
  ctx.textAlign = "right";
  ctx.fillStyle = MUTED;
  ctx.fillText("TECHSOCI × ALGOZENITH", W - L, H - 104);
  ctx.textAlign = "left";
  spacing(ctx, 0);
}

function mix(hex: string, to: string, t: number) {
  const a = parseInt(hex.replace("#", "").slice(0, 6), 16);
  const b = parseInt(to.replace("#", "").slice(0, 6), 16);
  const ch = (s: number) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

function cropMarks(ctx: Ctx, W: number, H: number, color: string) {
  const i = 26;
  const s = 30;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [x, y, dx, dy] of [
    [i, i, 1, 1],
    [W - i, i, -1, 1],
    [i, H - i, 1, -1],
    [W - i, H - i, -1, -1],
  ]) {
    ctx.moveTo(x, y + dy * s);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * s, y);
  }
  ctx.stroke();
}

function drawTile(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  i: number,
  member: PublicTeam["members"][number] | undefined,
  agent: Agent | undefined,
  face: HTMLImageElement | null,
  roleIcon: HTMLImageElement | null,
) {
  const base = agent?.colors[0] ?? RED;
  const cut = 34;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - cut, y);
  ctx.lineTo(x + w, y + cut);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + cut, y + h);
  ctx.lineTo(x, y + h - cut);
  ctx.closePath();
  ctx.clip();

  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, mix(base, "#ffffff", 0.38));
  g.addColorStop(0.55, mix(base, "#ffffff", 0.08));
  g.addColorStop(1, mix(base, "#0f1923", 0.45));
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 10;
  for (let sx = x - h; sx < x + w; sx += 34) {
    ctx.beginPath();
    ctx.moveTo(sx, y + h);
    ctx.lineTo(sx + h, y);
    ctx.stroke();
  }

  ctx.font = DISPLAY(Math.round(h * 0.78));
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillText((member?.agent ?? "").toUpperCase(), x + 14, y + h * 0.74);

  if (face) {
    const size = h * 1.22;
    ctx.save();
    ctx.shadowColor = "rgba(15,25,35,0.35)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = -10;
    ctx.drawImage(face, x + w - size * 0.86, y - size * 0.06, size, size);
    ctx.restore();
  }

  const scrim = ctx.createLinearGradient(0, y + h - 190, 0, y + h);
  scrim.addColorStop(0, "rgba(15,25,35,0)");
  scrim.addColorStop(1, "rgba(15,25,35,0.92)");
  ctx.fillStyle = scrim;
  ctx.fillRect(x, y + h - 190, w, 190);

  if (roleIcon) {
    ctx.globalAlpha = 0.9;
    ctx.drawImage(roleIcon, x + 22, y + 22, 40, 40);
    ctx.globalAlpha = 1;
  }
  ctx.font = DISPLAY(44);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(`0${i + 1}`, x + 74, y + 60);

  const tx = x + 26;
  ctx.font = LABEL(15);
  spacing(ctx, 4);
  ctx.fillStyle = "rgba(236,232,225,0.72)";
  ctx.fillText((member?.role ?? "").toUpperCase(), tx, y + h - 98);
  spacing(ctx, 0);
  ctx.font = BODY(34, 600);
  ctx.fillStyle = CREAM;
  ctx.fillText(ellipsize(ctx, member?.name ?? "", w - 52), tx, y + h - 58);
  ctx.font = LABEL(16);
  spacing(ctx, 4);
  ctx.fillStyle = "#ff6b77";
  ctx.fillText(`${(member?.agent ?? "").toUpperCase()} — ${(agent?.role ?? "Agent").toUpperCase()}`, tx, y + h - 26);
  spacing(ctx, 0);
  ctx.restore();
}

function barcode(ctx: Ctx, seed: string, x: number, y: number, w: number, h: number) {
  const r = rng(hash(seed));
  let cx = x;
  ctx.fillStyle = CREAM;
  while (cx < x + w) {
    const bw = 2 + Math.floor(r() * 4) * 2;
    if (cx + bw > x + w) break;
    ctx.fillRect(cx, y, bw, h);
    cx += bw + 3 + Math.floor(r() * 3) * 3;
  }
}

function drawBack(
  ctx: Ctx,
  team: PublicTeam,
  agents: (Agent | undefined)[],
  icons: (HTMLImageElement | null)[],
  host: string,
) {
  const W = FACE_W;
  const H = FACE_H;
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W, 0, 40, W, 0, W * 1.1);
  glow.addColorStop(0, "rgba(255,70,85,0.28)");
  glow.addColorStop(1, "rgba(255,70,85,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(236,232,225,0.05)";
  ctx.lineWidth = 2;
  for (let gx = 0; gx <= W; gx += 92) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }
  grain(ctx, W, H, hash(team.slug) + 7, "rgba(236,232,225,0.035)", 7000);

  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(W, H - 230);
  ctx.lineTo(W, H);
  ctx.lineTo(W - 230, H);
  ctx.closePath();
  ctx.fill();

  slot(ctx, true);
  const L = 72;
  ctx.textBaseline = "alphabetic";
  ctx.font = LABEL(22);
  spacing(ctx, 5);
  ctx.fillStyle = RED;
  ctx.fillText(`MATCH PASS // ${passNo(team)}`, L, 162);
  spacing(ctx, 0);

  ctx.font = DISPLAY(200);
  ctx.fillStyle = CREAM;
  ctx.fillText("CODEZILLA", L - 6, 340);
  const cw = ctx.measureText("CODEZILLA").width;
  ctx.fillStyle = RED;
  ctx.font = DISPLAY(96);
  ctx.fillText("3.0", L + cw + 14, 340);

  ctx.font = LABEL(18);
  spacing(ctx, 5);
  ctx.fillStyle = MUTED;
  ctx.fillText("SQUAD", L, 412);
  spacing(ctx, 0);
  const fit = fitLines(ctx, team.teamName, W - L * 2, 2, 112, 56);
  ctx.font = DISPLAY(fit.size);
  ctx.fillStyle = CREAM;
  const lh = fit.size * 0.9;
  let y = 420 + fit.size * 0.86;
  fit.lines.forEach((line, i) => ctx.fillText(line, L - 3, y + i * lh));
  y += (fit.lines.length - 1) * lh + 46;

  ctx.fillStyle = "rgba(236,232,225,0.16)";
  ctx.fillRect(L, y, W - L * 2, 2);
  const row = 148;
  team.members.forEach((m, i) => {
    const agent = agents[i];
    const ry = y + 26 + i * row;
    const s = 112;
    const g = ctx.createLinearGradient(L, ry, L + s, ry + s);
    g.addColorStop(0, mix(agent?.colors[0] ?? RED, "#ffffff", 0.3));
    g.addColorStop(1, agent?.colors[1] ?? INK_2);
    ctx.fillStyle = g;
    ctx.fillRect(L, ry, s, s);
    const icon = icons[i];
    if (icon) ctx.drawImage(icon, L, ry, s, s);
    ctx.strokeStyle = "rgba(236,232,225,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(L + 1, ry + 1, s - 2, s - 2);

    const tx = L + s + 32;
    ctx.font = LABEL(17);
    spacing(ctx, 4);
    ctx.fillStyle = MUTED;
    ctx.fillText(`0${i + 1} / ${m.role.toUpperCase()}`, tx, ry + 30);
    spacing(ctx, 0);
    ctx.font = BODY(38, 600);
    ctx.fillStyle = CREAM;
    ctx.fillText(ellipsize(ctx, m.name, W - tx - L), tx, ry + 74);
    ctx.font = LABEL(18);
    spacing(ctx, 4);
    ctx.fillStyle = RED;
    ctx.fillText(`${m.agent.toUpperCase()} · ${(agent?.role ?? "Agent").toUpperCase()}`, tx, ry + 106);
    spacing(ctx, 0);
    ctx.fillStyle = "rgba(236,232,225,0.1)";
    ctx.fillRect(L, ry + row - 12, W - L * 2, 2);
  });
  y += 26 + row * team.members.length + 20;

  const cells: [string, string][] = [
    ["DATE", "5 OCT*"],
    ["VENUE", "LABS"],
    ["FORMAT", "OPEN BOOK"],
  ];
  const cellW = (W - L * 2) / cells.length;
  cells.forEach(([k, v], i) => {
    const cx = L + i * cellW;
    ctx.font = LABEL(16);
    spacing(ctx, 4);
    ctx.fillStyle = MUTED;
    ctx.fillText(k, cx, y + 20);
    spacing(ctx, 0);
    ctx.font = DISPLAY(70);
    ctx.fillStyle = CREAM;
    ctx.fillText(v, cx, y + 96);
  });
  ctx.font = BODY(17);
  ctx.fillStyle = MUTED;
  ctx.fillText("*Tentative. Final schedule on Unstop. Labs at IIIT Sonepat, online if remote.", L, y + 134);

  const bcY = H - 196;
  barcode(ctx, team.slug, L, bcY, 520, 74);
  ctx.font = LABEL(17);
  spacing(ctx, 3);
  ctx.fillStyle = MUTED;
  ctx.fillText(ellipsize(ctx, `${host}/team/${team.slug}`.toUpperCase(), 640), L, bcY + 110);
  spacing(ctx, 0);
  stamp(ctx, 800, H - 205, passNo(team));
  cropMarks(ctx, W, H, "rgba(236,232,225,0.3)");
  ctx.save();
  ctx.translate(W - 64, H - 64);
  ctx.fillStyle = INK;
  ctx.font = DISPLAY(64);
  ctx.textAlign = "right";
  ctx.fillText(String(team.number || 0).padStart(3, "0"), 0, 0);
  ctx.restore();
}

function stamp(ctx: Ctx, cx: number, cy: number, label: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.24);
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = RED;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 84, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = RED;
  ctx.textAlign = "center";
  ctx.font = DISPLAY(46);
  ctx.fillText("LOCKED IN", 0, 10);
  ctx.font = LABEL(13);
  spacing(ctx, 3);
  ctx.fillText(label, 0, 38);
  ctx.fillText("CZ 3.0", 0, -30);
  spacing(ctx, 0);
  ctx.restore();
}

function blit(atlas: Ctx, face: HTMLCanvasElement, rect: { x: number; y: number; w: number; h: number }) {
  atlas.drawImage(face, rect.x * ATLAS, rect.y * ATLAS, rect.w * ATLAS, rect.h * ATLAS);
}

export async function drawCardAtlas(team: PublicTeam, host = window.location.host): Promise<HTMLCanvasElement> {
  const agents = team.members.map((m) => AGENT_BY_NAME.get(m.agent));
  const load = (src?: string) => (src ? loadImage(src) : Promise.resolve(null));
  const [, icons, roleIcons] = await Promise.all([
    loadFonts(),
    Promise.all(agents.map((a) => load(a?.icon))),
    Promise.all(agents.map((a) => load(a?.roleIcon))),
  ]);

  const front = canvas(FACE_W, FACE_H);
  drawFront(front.getContext("2d")!, team, agents, icons, roleIcons);
  const back = canvas(FACE_W, FACE_H);
  drawBack(back.getContext("2d")!, team, agents, icons, host);

  const atlas = canvas(ATLAS, ATLAS);
  const a = atlas.getContext("2d")!;
  a.fillStyle = INK;
  a.fillRect(0, 0, ATLAS, ATLAS);
  blit(a, front, FRONT_RECT);
  blit(a, back, BACK_RECT);
  return atlas;
}

export function drawStrap(): HTMLCanvasElement {
  const c = canvas(1024, 128);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = RED;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "rgba(15,25,35,0.85)";
  ctx.fillRect(0, 10, c.width, 4);
  ctx.fillRect(0, c.height - 14, c.width, 4);
  ctx.font = DISPLAY(74);
  ctx.textBaseline = "middle";
  ctx.fillStyle = CREAM;
  spacing(ctx, 6);
  ctx.fillText("CODEZILLA 3.0  ✦  THE SPIKE RUSH  ✦", 22, c.height / 2 + 4);
  return c;
}
