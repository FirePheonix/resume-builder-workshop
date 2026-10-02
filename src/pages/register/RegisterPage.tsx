import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SpikeGlyph, beep } from "../landing/SpikeButton";
import { AGENTS, AGENT_BY_NAME, ROLES, ROLE_ICON, VALORANT_CHARACTERS, type Agent } from "./agents";
import imgRaze from "../../assets/valorant/raze.png";
import imgReyna from "../../assets/valorant/reyna.png";
import "../landing/landing.css";
import "./register.css";

// ── Schema (mirrors backend) ─────────────────────────────────────────────────
const memberSchema = z.object({
  name: z.string().trim().min(2, "Min 2 characters").max(50),
  email: z.string().trim().email("Invalid email"),
  mobile: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "10 digits, starts 6-9"),
  valorantCharacter: z.enum(VALORANT_CHARACTERS, { message: "Pick an agent" }),
});

const formSchema = z
  .object({
    teamName: z.string().trim().min(3, "Min 3 characters").max(30, "Max 30 characters"),
    leader: memberSchema,
    member2: memberSchema,
    member3: memberSchema,
  })
  .refine(
    (d) => new Set([d.leader.email, d.member2.email, d.member3.email].map((x) => x.toLowerCase())).size === 3,
    { message: "All emails must be different", path: ["member3", "email"] }
  )
  .refine(
    (d) => new Set([d.leader.mobile, d.member2.mobile, d.member3.mobile].map((x) => x.replace(/[\s\-+]/g, "").slice(-10))).size === 3,
    { message: "All mobile numbers must be different", path: ["member3", "mobile"] }
  );

type FormData = z.infer<typeof formSchema>;
type SlotKey = "leader" | "member2" | "member3";

const SLOTS: { key: SlotKey; label: string; short: string }[] = [
  { key: "leader", label: "Team Leader (You)", short: "Leader" },
  { key: "member2", label: "Member 2", short: "M2" },
  { key: "member3", label: "Member 3", short: "M3" },
];

const API_URL = import.meta.env.VITE_API_URL || "";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const MUTE_KEY = "cz-register-muted";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type User = { email: string; name: string; picture: string; credential: string };

// ── Voice lines ──────────────────────────────────────────────────────────────
function useVoice() {
  const [muted, setMuted] = useState(() => localStorage.getItem(MUTE_KEY) === "1");
  const [line, setLine] = useState<{ agent: Agent; text: string } | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const nextIdx = useRef<Record<string, number>>({});

  const stop = () => {
    audio.current?.pause();
    audio.current = null;
    setSpeaking(false);
  };

  const speak = useCallback(
    (agent: Agent, replay = false) => {
      stop();
      if (!agent.voices.length) {
        setLine(null);
        return;
      }
      const n = nextIdx.current[agent.slug] ?? 0;
      const i = replay ? Math.max(0, n - 1) % agent.voices.length : n % agent.voices.length;
      if (!replay) nextIdx.current[agent.slug] = n + 1;
      const v = agent.voices[i];
      setLine({ agent, text: v.text });
      if (muted) return;
      const a = new Audio(v.src);
      a.volume = 0.85;
      a.onended = () => setSpeaking(false);
      audio.current = a;
      a.play().then(() => setSpeaking(true)).catch(() => setSpeaking(false));
    },
    [muted]
  );

  const toggleMute = () => {
    setMuted((m) => {
      localStorage.setItem(MUTE_KEY, m ? "0" : "1");
      if (!m) stop();
      return !m;
    });
  };

  useEffect(() => stop, []);
  return { muted, toggleMute, speak, line, speaking };
}

// ── Icons ────────────────────────────────────────────────────────────────────
const SpeakerIcon = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5L6 9H3v6h3l5 4V5z" />
    {muted ? <path d="M22 9l-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />}
  </svg>
);
const ReplayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

// ── Sign-in screen ───────────────────────────────────────────────────────────
function SignIn({ gsiReady, error }: { gsiReady: boolean; error: string }) {
  return (
    <div className="lp rg">
      <div className="rg-auth">
        <section className="rg-auth__panel">
          <div className="rg-auth__top">
            <Link to="/" className="lp-logo">
              <span className="lp-logo__mark" style={{ color: "var(--cream)" }}>CZ</span>
              <span className="lp-logo__text">Codezilla <b>3.0</b></span>
            </Link>
            <Link to="/" className="rg-auth__back">← Back to Home</Link>
          </div>

          <div className="rg-auth__body">
            <p className="lp-label rg-auth__eyebrow">Team Registration</p>
            <h1 className="lp-display rg-auth__title">
              Sign <span>In</span>
            </h1>
            <p className="rg-auth__lead">
              Sign in with your Google account to get started. You'll fill out details for all 3 team members.
            </p>
            <div className="rg-auth__notice">
              <i>!</i> Only the team leader fills this form
            </div>

            <div className="rg-gsi">
              {/* GSI sizes its iframe from the container, so it must not be display:none when rendered. */}
              <div id="google-signin-btn" />
              {!gsiReady && <span className="rg-gsi__loading">Connecting to Google</span>}
            </div>
            {error && <div className="rg-error">{error}</div>}

            <ol className="rg-auth__steps">
              <li><b>01</b>Sign in with Google</li>
              <li><b>02</b>Pick agents & fill team details</li>
              <li><b>03</b>Lock in & get confirmation</li>
            </ol>
          </div>

          <p className="rg-auth__foot">Codezilla 3.0 // The Spike Rush</p>
        </section>

        <section className="rg-auth__art" aria-hidden="true">
          <video src="/valorant/hero.mp4" poster="/valorant/hero-poster.jpg" autoPlay muted loop playsInline />
          <div className="rg-auth__agents">
            <img src={imgRaze} alt="" />
            <img src={imgReyna} alt="" />
          </div>
          <div className="rg-auth__art-copy">
            <h2 className="lp-display">Codezilla <span>3.0</span></h2>
            <p className="lp-tagline"><SpikeGlyph /> The Spike Rush</p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Agent card ───────────────────────────────────────────────────────────────
function AgentCard({
  agent,
  selected,
  takenBy,
  onPick,
  onHover,
}: {
  agent: Agent;
  selected: boolean;
  takenBy?: string;
  onPick: () => void;
  onHover: (a: Agent | null) => void;
}) {
  return (
    <button
      type="button"
      className={`rg-card${selected ? " is-selected" : ""}`}
      style={{ ["--c1" as string]: agent.colors[0], ["--c2" as string]: agent.colors[1] }}
      disabled={!!takenBy}
      onClick={onPick}
      onMouseEnter={() => {
        onHover(agent);
        new Image().src = agent.portrait;
      }}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(agent)}
      onBlur={() => onHover(null)}
      aria-pressed={selected}
      aria-label={`${agent.name}, ${agent.role}${takenBy ? `, taken by ${takenBy}` : ""}`}
    >
      <img className="rg-card__icon" src={agent.icon} alt="" loading="lazy" />
      {!agent.voices.length && <span className="rg-card__mute">No VO</span>}
      <span className="rg-card__meta">
        <span className="rg-card__name">{agent.name}</span>
        <span className="rg-card__role"><img src={agent.roleIcon} alt="" />{agent.role}</span>
      </span>
      {takenBy && (
        <span className="rg-card__taken"><span>{takenBy}</span></span>
      )}
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [serverError, setServerError] = useState("");
  const [phase, setPhase] = useState<"form" | "submitting" | "locked">("form");
  const [gsiReady, setGsiReady] = useState(false);
  const [active, setActive] = useState<SlotKey>("leader");
  const [locked, setLocked] = useState<Record<SlotKey, boolean>>({ leader: false, member2: false, member3: false });
  const [justLocked, setJustLocked] = useState<SlotKey | null>(null);
  const [hovered, setHovered] = useState<Agent | null>(null);
  const [role, setRole] = useState<string>("All");
  const voice = useVoice();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    setFocus,
    getFieldState,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({ resolver: zodResolver(formSchema), mode: "onTouched" });

  const values = watch();
  const picks: Record<SlotKey, string | undefined> = {
    leader: values.leader?.valorantCharacter,
    member2: values.member2?.valorantCharacter,
    member3: values.member3?.valorantCharacter,
  };

  // A locked slot unlocks as soon as any of its fields change.
  const lockedSnapshot = useRef<Record<string, string>>({});
  useEffect(() => {
    (Object.keys(locked) as SlotKey[]).forEach((k) => {
      if (!locked[k]) return;
      const snap = JSON.stringify(values[k] ?? {});
      if (lockedSnapshot.current[k] !== snap) setLocked((l) => ({ ...l, [k]: false }));
    });
  });

  // ── Google Sign-In ───────────────────────────────────────────────────────
  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      setServerError("");
      try {
        const payload = JSON.parse(atob(response.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        const info = { email: payload.email || "", name: payload.name || "", picture: payload.picture || "", credential: response.credential };
        setUser(info);
        setValue("leader.name", info.name);
        setValue("leader.email", info.email);
      } catch {
        setServerError("Failed to process Google sign-in. Please try again.");
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (user) return;
    if (import.meta.env.DEV && new URLSearchParams(location.search).has("preview")) {
      handleCredentialResponse({ credential: `x.${btoa(JSON.stringify({ email: "leader@iiitsonepat.ac.in", name: "Preview Leader" }))}.x` });
      return;
    }
    const initGsi = () => {
      window.google?.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredentialResponse });
      const el = document.getElementById("google-signin-btn");
      if (el) {
        window.google?.accounts.id.renderButton(el, { theme: "filled_black", size: "large", text: "continue_with", shape: "rectangular", width: 300 });
      }
      setGsiReady(true);
    };
    if (window.google?.accounts) {
      initGsi();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGsi;
    document.head.appendChild(script);
  }, [handleCredentialResponse, user]);

  // ── Slot actions ─────────────────────────────────────────────────────────
  const activeIdx = SLOTS.findIndex((s) => s.key === active);
  const activeSlot = SLOTS[activeIdx];
  const activeAgent = picks[active] ? AGENT_BY_NAME.get(picks[active]!) : undefined;
  const shown = hovered ?? activeAgent;
  const lockedCount = SLOTS.filter((s) => locked[s.key]).length;
  const allLocked = lockedCount === 3;

  const takenBy = (agentName: string) => {
    const owner = SLOTS.find((s) => s.key !== active && picks[s.key] === agentName);
    return owner?.short;
  };

  const pickAgent = (agent: Agent) => {
    setValue(`${active}.valorantCharacter`, agent.name as FormData["leader"]["valorantCharacter"], { shouldValidate: isSubmitted, shouldDirty: true });
    voice.speak(agent);
  };

  const lockIn = async () => {
    const ok = await trigger([`${active}.name`, `${active}.email`, `${active}.mobile`, `${active}.valorantCharacter`]);
    if (!ok) {
      beep(220, 0.18, 0.05);
      const firstBad = (["name", "email", "mobile"] as const).find((f) => getFieldState(`${active}.${f}`).invalid);
      if (firstBad) setFocus(`${active}.${firstBad}`);
      return;
    }
    lockedSnapshot.current[active] = JSON.stringify(values[active]);
    setLocked((l) => ({ ...l, [active]: true }));
    setJustLocked(active);
    beep(660, 0.08, 0.05);
    setTimeout(() => beep(990, 0.16, 0.05), 90);
    const next = SLOTS.find((s, i) => i > activeIdx && !locked[s.key]) ?? SLOTS.find((s) => s.key !== active && !locked[s.key]);
    if (next) setTimeout(() => setActive(next.key), 350);
  };

  const onInvalid = (errs: FieldErrors<FormData>) => {
    beep(220, 0.18, 0.05);
    if (errs.teamName) {
      setFocus("teamName");
      return;
    }
    const bad = SLOTS.find((s) => errs[s.key]);
    if (bad) setActive(bad.key);
  };

  async function onSubmit(data: FormData) {
    if (!user) return;
    setPhase("submitting");
    setServerError("");
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.credential}` },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(body.error || "Something went wrong. Please try again.");
        setPhase("form");
        return;
      }
      setPhase("locked");
      beep(520, 0.12, 0.06);
      setTimeout(() => beep(780, 0.4, 0.06), 120);
      setTimeout(
        () =>
          navigate("/thank-you", {
            state: {
              teamName: data.teamName,
              leaderName: data.leader.name,
              leaderEmail: data.leader.email,
              member2Name: data.member2.name,
              member3Name: data.member3.name,
              leaderAgent: data.leader.valorantCharacter,
              member2Agent: data.member2.valorantCharacter,
              member3Agent: data.member3.valorantCharacter,
            },
          }),
        2200
      );
    } catch (err) {
      console.error(err);
      setServerError("Network error. Check your connection and try again.");
      setPhase("form");
    }
  }

  const visibleAgents = useMemo(() => (role === "All" ? AGENTS : AGENTS.filter((a) => a.role === role)), [role]);

  if (!user) return <SignIn gsiReady={gsiReady} error={serverError} />;

  const e = errors[active];
  const memberError = e?.name || e?.email || e?.mobile || e?.valorantCharacter;
  const slotStatus = (k: SlotKey) => {
    if (locked[k]) return { cls: "is-locked", text: "Locked In" };
    if (errors[k]) return { cls: "is-error", text: "Needs Attention" };
    if (k === active) return { cls: "is-picking", text: "Picking" };
    return { cls: "", text: picks[k] ? "Not Locked" : "Waiting" };
  };

  return (
    <div className="lp rg">
      <header className="rg-bar">
        <Link to="/" className="lp-logo">
          <span className="lp-logo__mark">CZ</span>
          <span className="lp-logo__text">Codezilla <b>3.0</b></span>
        </Link>
        <span className="lp-label rg-bar__mode">Agent Select // <b>The Spike Rush</b></span>
        <div className="rg-bar__right">
          <span className="lp-label rg-bar__progress">
            <span className="rg-bar__pips">{SLOTS.map((s) => <i key={s.key} className={locked[s.key] ? "on" : ""} />)}</span>
            {lockedCount}/3
          </span>
          <button type="button" className="rg-icon-btn" onClick={voice.toggleMute} aria-label={voice.muted ? "Unmute agent voices" : "Mute agent voices"} title={voice.muted ? "Unmute voices" : "Mute voices"}>
            <SpeakerIcon muted={voice.muted} />
          </button>
          <span className="rg-user">
            {user.picture ? <img src={user.picture} alt="" referrerPolicy="no-referrer" /> : <span className="rg-user__init">{user.name.charAt(0)}</span>}
            <span>{user.name.split(" ")[0]}</span>
          </span>
        </div>
      </header>

      <form
        className="rg-main"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        onKeyDown={(ev) => {
          const t = ev.target as HTMLInputElement;
          if (ev.key === "Enter" && t.tagName === "INPUT" && t.name !== "teamName" && !allLocked) {
            ev.preventDefault();
            lockIn();
          }
        }}
        noValidate
      >
        {/* Team name */}
        <div className="rg-squadname">
          <label className="rg-field rg-squadname__field">
            <span className="rg-field__label">
              Team Name {errors.teamName && <b>{errors.teamName.message}</b>}
            </span>
            <input {...register("teamName")} placeholder="e.g. Runtime Terror" autoComplete="off" maxLength={30} className={errors.teamName ? "is-error" : ""} />
          </label>
          <p className="rg-squadname__meta">
            Registering as <b>{user.email}</b>. Pick an agent and lock in each of your 3 members.
          </p>
        </div>

        {serverError && <div className="rg-error rg-error--dark" style={{ marginBottom: 18 }}>{serverError}</div>}

        <div className="rg-stage">
          {/* Roster */}
          <div className="rg-roster">
            <span className="lp-label rg-roster__title">Team Members</span>
            {SLOTS.map((s) => {
              const ag = picks[s.key] ? AGENT_BY_NAME.get(picks[s.key]!) : undefined;
              const st = slotStatus(s.key);
              const nm = values[s.key]?.name?.trim();
              return (
                <button key={s.key} type="button" className={`rg-slot${active === s.key ? " is-active" : ""}`} onClick={() => setActive(s.key)}>
                  <span className="rg-slot__pic">
                    {ag ? <img src={ag.icon} alt="" /> : <span>?</span>}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="rg-slot__role">{s.label}</span>
                    <span className="rg-slot__name">{ag?.name ?? (nm || "—")}</span>
                    <span className={`rg-slot__status ${st.cls}`}>{st.text}</span>
                  </span>
                  {locked[s.key] && justLocked === s.key && <span className="rg-slot__stamp">Locked</span>}
                </button>
              );
            })}
          </div>

          {/* Showcase */}
          <div
            className="rg-show"
            style={shown ? { ["--c1" as string]: shown.colors[0], ["--c2" as string]: shown.colors[1] } : undefined}
          >
            <div className="rg-show__grid" />
            {shown ? (
              <>
                <img key={`bg-${shown.slug}`} className="rg-show__bgart" src={shown.background} alt="" />
                <img key={`p-${shown.slug}`} className="rg-show__portrait" src={shown.portrait} alt="" />
                <div className="rg-show__info">
                  <span className="lp-label rg-show__for">
                    {hovered && hovered !== activeAgent ? "Previewing" : "Selected"} · {activeSlot.label}
                  </span>
                  <h2 key={`n-${shown.slug}`} className="lp-display rg-show__name">{shown.name}</h2>
                  <span className="lp-label rg-show__role"><img src={shown.roleIcon} alt="" />{shown.role}</span>
                  <p className="rg-show__desc">{shown.description}</p>
                  <div className="rg-show__abilities">
                    {shown.abilities.map((ab, i) => (
                      <span key={ab.slot} className="rg-show__ab" data-name={ab.name}>
                        <img src={ab.icon} alt={ab.name} />
                        <span>{["C", "Q", "E", "X"][i] ?? ""}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rg-show__empty">
                <div>
                  <b>Select<br />Agent</b>
                  <p>Pick an agent for {activeSlot.label.toLowerCase()} from the cards below.</p>
                </div>
              </div>
            )}
            {voice.line && (!hovered || hovered === activeAgent) && voice.line.agent === activeAgent && (
              <div key={voice.line.text} className={`rg-voice${voice.speaking ? " is-speaking" : ""}`}>
                <span className="rg-voice__eq"><i /><i /><i /><i /></span>
                <span className="rg-voice__text"><em>{voice.line.agent.name}</em>“{voice.line.text}”</span>
                <button type="button" className="rg-voice__btn" onClick={() => voice.speak(voice.line!.agent, false)} aria-label="Play another voice line" title="Another line">
                  <ReplayIcon />
                </button>
              </div>
            )}
          </div>

          {/* Dossier */}
          <div className="rg-dossier">
            <div className="rg-dossier__head">
              <h3 className="lp-display">{activeSlot.key === "leader" ? "Leader" : activeSlot.label}</h3>
              <span className="lp-label">{activeIdx + 1} / 3</span>
            </div>
            {SLOTS.map((s) => {
              const er = errors[s.key];
              return (
                <div key={s.key} style={{ display: s.key === active ? "contents" : "none" }}>
                  <label className="rg-field">
                    <span className="rg-field__label">Full Name {er?.name && <b>{er.name.message}</b>}</span>
                    <input {...register(`${s.key}.name`)} className={`rg-input${er?.name ? " is-error" : ""}`} placeholder="John Doe" autoComplete="off" />
                  </label>
                  <label className="rg-field">
                    <span className="rg-field__label">Email {er?.email && <b>{er.email.message}</b>}</span>
                    <input {...register(`${s.key}.email`)} type="email" readOnly={s.key === "leader"} className={`rg-input${er?.email ? " is-error" : ""}`} placeholder="john@example.com" autoComplete="off" />
                  </label>
                  <label className="rg-field">
                    <span className="rg-field__label">Mobile Number {er?.mobile && <b>{er.mobile.message}</b>}</span>
                    <input {...register(`${s.key}.mobile`)} type="tel" inputMode="numeric" className={`rg-input${er?.mobile ? " is-error" : ""}`} placeholder="9876543210" autoComplete="off" />
                  </label>
                  <input type="hidden" {...register(`${s.key}.valorantCharacter`)} />
                </div>
              );
            })}
            <div className={`rg-dossier__agent${e?.valorantCharacter ? " is-error" : ""}`}>
              <span className="lp-label">Valorant Agent</span>
              {activeAgent ? <b>{activeAgent.name}</b> : <span>{e?.valorantCharacter ? "Pick an agent ↓" : "Select below ↓"}</span>}
            </div>

            <div className="rg-dossier__actions">
              {!allLocked && (
                <button type="button" className="rg-lock" onClick={lockIn} disabled={phase !== "form"}>
                  {locked[active] ? "Locked In ✓" : "Lock In"}
                </button>
              )}
              <button type="submit" className={`rg-lock rg-lock--deploy${allLocked ? " is-ready" : ""}`} disabled={phase !== "form"}>
                Submit Registration
              </button>
              <p className="rg-dossier__hint">
                {memberError ? "Fix the highlighted fields to lock in." : allLocked ? "Squad locked. Deploy when ready." : "Lock in each member, then submit."}
              </p>
            </div>
          </div>
        </div>

        {/* Agent grid */}
        <section className="rg-pick">
          <div className="rg-pick__head">
            <h3 className="lp-display">Choose <span>Agent</span></h3>
            <span className="lp-label" style={{ color: "var(--muted)" }}>for {activeSlot.label}</span>
            <div className="rg-filters" role="tablist" aria-label="Filter agents by role">
              {["All", ...ROLES].map((r) => (
                <button key={r} type="button" role="tab" aria-selected={role === r} className={`rg-filter${role === r ? " is-on" : ""}`} onClick={() => setRole(r)}>
                  {r !== "All" && <img src={ROLE_ICON.get(r)} alt="" />}
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="rg-grid">
            {visibleAgents.map((a) => (
              <AgentCard
                key={a.slug}
                agent={a}
                selected={picks[active] === a.name}
                takenBy={takenBy(a.name)}
                onPick={() => pickAgent(a)}
                onHover={setHovered}
              />
            ))}
          </div>
        </section>
      </form>

      {phase === "submitting" && (
        <div className="rg-overlay rg-overlay--busy" role="status">
          <div className="rg-overlay__copy">
            <p className="lp-display">Deploying Squad</p>
            <div className="rg-scan" />
          </div>
        </div>
      )}
      {phase === "locked" && (
        <div className="rg-overlay" role="status">
          <div className="rg-overlay__agents">
            {SLOTS.map((s) => {
              const ag = picks[s.key] ? AGENT_BY_NAME.get(picks[s.key]!) : undefined;
              return ag ? <img key={s.key} src={ag.portrait} alt="" /> : null;
            })}
          </div>
          <div className="rg-overlay__copy">
            <p className="lp-label">{values.teamName}</p>
            <h2 className="lp-display">Squad <span>Locked</span></h2>
          </div>
        </div>
      )}
    </div>
  );
}
