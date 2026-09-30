import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_MS = 1100;

let audioCtx: AudioContext | null = null;
export function beep(freq: number, dur = 0.06, gain = 0.05) {
  try {
    audioCtx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch {
    /* audio is decorative */
  }
}

export function SpikeGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l5 6.5V20l-5 2-5-2V8.5L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 7v9M9.5 13.5L12 16l2.5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Phase = "idle" | "holding" | "planted";

export default function SpikeButton({ onPlanted, label = "Register Now" }: { onPlanted: () => void; label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);
  const start = useRef(0);
  const nextBeep = useRef(0);
  const hintTimer = useRef(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hint, setHint] = useState(false);

  const setP = (p: number) => ref.current?.style.setProperty("--p", String(p));

  const tick = useCallback(
    (now: number) => {
      const p = Math.min((now - start.current) / HOLD_MS, 1);
      setP(p);
      if (now >= nextBeep.current) {
        beep(1600 + p * 900);
        nextBeep.current = now + 240 - p * 190;
      }
      if (p >= 1) {
        setPhase("planted");
        beep(880, 0.35, 0.06);
        setTimeout(onPlanted, 450);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    },
    [onPlanted]
  );

  const begin = () => {
    if (phase !== "idle") return;
    setHint(false);
    setPhase("holding");
    start.current = performance.now();
    nextBeep.current = 0;
    raf.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    if (phase !== "holding") return;
    cancelAnimationFrame(raf.current);
    const held = performance.now() - start.current;
    setPhase("idle");
    setP(0);
    if (held < HOLD_MS * 0.4) {
      setHint(false);
      requestAnimationFrame(() => setHint(true));
      clearTimeout(hintTimer.current);
      hintTimer.current = window.setTimeout(() => setHint(false), 2200);
    }
  };

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(hintTimer.current);
    },
    []
  );

  const text =
    phase === "planted" ? "Spike Planted" : phase === "holding" ? "Planting…" : label;
  const sub =
    phase === "planted" ? "Deploying registration" : hint ? "Keep holding to plant" : "Press & hold to plant";

  return (
    <button
      ref={ref}
      type="button"
      className={`lp-spike${phase === "holding" ? " is-holding" : ""}${phase === "planted" ? " is-planted" : ""}${hint ? " is-hint" : ""}`}
      aria-label={`${label} — press and hold to continue`}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already released */
        }
        begin();
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          begin();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") cancel();
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="lp-spike__fill" />
      <span className="lp-spike__icon">
        <svg className="lp-spike__ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle className="bg" cx="22" cy="22" r="20" />
          <circle className="fg" cx="22" cy="22" r="20" />
        </svg>
        <SpikeGlyph className="lp-spike__glyph" />
      </span>
      <span className="lp-spike__text">
        <span>{text}</span>
        <small>{sub}</small>
      </span>
    </button>
  );
}
