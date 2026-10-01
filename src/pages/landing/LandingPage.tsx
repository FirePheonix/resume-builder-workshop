import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpikeButton, { SpikeGlyph } from "./SpikeButton";
import "./landing.css";

import imgRaze from "../../assets/valorant/raze.png";
import imgReyna from "../../assets/valorant/reyna.png";
import imgMap from "../../assets/valorant/map.png";
import imgArt1 from "../../assets/valorant/art-1.jpg";
import imgArt2 from "../../assets/valorant/art-2.jpg";
import imgArt3 from "../../assets/valorant/art-3.jpg";
import imgTechSoci from "../../assets/TechSoci-logo.svg";
import imgAlgozenith from "../../assets/algozenith-logo.svg";

const SYLLABUS_URL = "https://github.com/FirePheonix/codathon-syllabus";
// Tentative: "Keep 5th October in mind for now."
const EVENT_DATE = new Date(`${new Date().getFullYear()}-10-05T10:00:00+05:30`);

const NAV = [
  { id: "briefing", label: "Briefing" },
  { id: "squad", label: "Squad" },
  { id: "match", label: "Match Info" },
  { id: "faq", label: "FAQs" },
  { id: "powered-by", label: "Powered By" },
];

type Ability = {
  key: "C" | "Q" | "E" | "X";
  slot: string;
  name: string;
  sub?: string;
  desc: string;
  media: { type: "video" | "img"; src: string };
};

const ABILITIES: Ability[] = [
  {
    key: "C",
    slot: "Basic Ability",
    name: "Open Book",
    desc: "We noticed that the students that caught cheating in previous year codathons knew the logic of the code. But forgot small syntaxes.",
    media: { type: "video", src: "/valorant/gameplay.mp4" },
  },
  {
    key: "Q",
    slot: "Basic Ability",
    name: "100",
    sub: "Questions",
    desc: "The syllabus contains 100 questions from multiple topics for every year. We'll only be making the test from those concepts. You ofc won't be able to solve them all in this much limited time - and yea that's the whole point.",
    media: { type: "img", src: imgArt3 },
  },
  {
    key: "E",
    slot: "Signature Ability",
    name: "50+ Teams",
    desc: "150 + was the number of teams in previous year's codathon.",
    media: { type: "img", src: imgArt2 },
  },
  {
    key: "X",
    slot: "Ultimate",
    name: "Get Guided",
    sub: "By Seniors",
    desc: "Get Guided By Seniors. Win Special Rewards.",
    media: { type: "img", src: imgArt1 },
  },
];

const FAQS = [
  { q: "Event dates?", a: "Not confirmed yet, but probably in the first or second week of October. Keep 5th October in mind for now." },
  { q: "Event venue?", a: "Probably offline — in labs. If not allotted, online." },
  { q: "Will we get internet for it?", a: "Yes — in fact, the codathon will be on a contest platform." },
  {
    q: "What type of notes are allowed?",
    a: "Only handwritten, or short, etc. notes. PRINTED notes are specially not allowed in any case. There shouldn't be a single trace of them. If found, might lead to immediate disqualification.",
  },
  { q: "Question format?", a: "Will be revealed soon. But surely, we'll make them derived from the questions in the list of questions we earlier provided." },
  { q: "Teams size?", a: "3 members. No ifs and doubts about that." },
];

const TICKER = [
  "Codezilla 3.0",
  "The Spike Rush",
  "Open Book",
  "100 Questions",
  "3 Members",
  "Handwritten Notes Only",
  "IIIT Sonepat",
  "Customized Per Batch",
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, target.getTime() - now);
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, done: ms === 0 };
}

const pad = (n: number) => String(n).padStart(2, "0");

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Nav({ onRegister }: { onRegister: () => void }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <nav className={`lp-nav${solid ? " is-solid" : ""}`}>
        <a href="#top" className="lp-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="lp-logo__mark">CZ</span>
          <span className="lp-logo__text">Codezilla <b>3.0</b></span>
        </a>
        <div className="lp-nav__links">
          {NAV.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="lp-nav__link" onClick={(e) => { e.preventDefault(); go(id); }}>
              {label}
            </a>
          ))}
        </div>
        <div className="lp-nav__cta">
          <a className="lp-btn lp-btn--ghost" href={SYLLABUS_URL} target="_blank" rel="noopener noreferrer">Syllabus</a>
          <button className="lp-btn lp-btn--red" onClick={onRegister}>Register</button>
        </div>
        <button className={`lp-burger${open ? " is-open" : ""}`} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </nav>
      <div className={`lp-drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        {NAV.map(({ id, label }, i) => (
          <a key={id} href={`#${id}`} tabIndex={open ? 0 : -1} onClick={(e) => { e.preventDefault(); go(id); }}>
            <small>0{i + 1}</small>{label}
          </a>
        ))}
        <a href={SYLLABUS_URL} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
          <small>0{NAV.length + 1}</small>Syllabus
        </a>
        <a href="/register" tabIndex={open ? 0 : -1} onClick={(e) => { e.preventDefault(); setOpen(false); onRegister(); }}>
          <small>0{NAV.length + 2}</small>Register
        </a>
      </div>
    </>
  );
}

function Hero({ onRegister }: { onRegister: () => void }) {
  const { d, h, m, s, done } = useCountdown(EVENT_DATE);
  return (
    <header className="lp-hero" id="top">
      <video className="lp-hero__video" src="/valorant/hero.mp4" poster="/valorant/hero-poster.jpg" autoPlay muted loop playsInline />
      <div className="lp-hero__shade" />
      <div className="lp-hero__scan" />
      <div className="lp-hero__frame"><i /><i /><i /><i /></div>

      <div className="lp-hud" aria-label="Countdown to the event">
        <div className="lp-hud__side lp-hud__side--atk"><b>0</b> Your Team</div>
        <div className="lp-hud__clock">
          <span className={`lp-hud__time${d === 0 && !done ? " is-low" : ""}`}>
            {done ? "LIVE" : `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`}
          </span>
          <span className="lp-hud__caption">{done ? "Match in progress" : "Until 5th Oct · Tentative"}</span>
        </div>
        <div className="lp-hud__side lp-hud__side--def">The Syllabus <b>0</b></div>
      </div>

      <div className="lp-hero__content">
        <p className="lp-label lp-hero__eyebrow">IIIT Sonepat // Open Book Codathon</p>
        <h1 className="lp-display lp-title">
          <span className="lp-title__word" data-text="Codezilla">Codezilla</span>
          <span className="lp-title__ver">3.0</span>
        </h1>
        <p className="lp-tagline"><SpikeGlyph /> The Spike Rush</p>
        <p className="lp-hero__lead">Open Book. Customized Per Batch Codathon.</p>
        <p className="lp-hero__sub">
          First ever open book codathon for IIIT Sonepat students. Bring any non-printed, handwritten notes you want. Test will be set of
          questions derived right from the list of questions given to you.
        </p>
        <div className="lp-hero__actions">
          <SpikeButton onPlanted={onRegister} />
          <a className="lp-btn lp-btn--ghost" href={SYLLABUS_URL} target="_blank" rel="noopener noreferrer">
            <span className="lp-btn__sq" /> Syllabus
          </a>
        </div>
      </div>

      <div className="lp-hero__rail">CDZ_3.0 // SPIKE RUSH</div>
    </header>
  );
}

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="lp-ticker" aria-hidden="true">
      <div className="lp-ticker__track">
        {items.map((t, i) => (
          <span key={i} className="lp-ticker__item">{t}<i /></span>
        ))}
      </div>
    </div>
  );
}

function Briefing() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const i = ABILITIES.findIndex((a) => a.key === e.key.toUpperCase());
      if (i >= 0) setActive(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView]);

  const a = ABILITIES[active];
  const isUlt = a.key === "X";

  return (
    <section
      id="briefing"
      ref={ref}
      className={`lp-brief${hovering || !inView ? " is-paused" : ""}`}
    >
      <div className="lp-sec-head" data-reveal>
        <span className="lp-sec-head__index">01</span>
        <h2 className="lp-display lp-sec-head__title">The Briefing</h2>
        <p className="lp-sec-head__sub">
          Your loadout for Codezilla 3.0. Press <kbd>C</kbd><kbd>Q</kbd><kbd>E</kbd><kbd>X</kbd> to switch.
        </p>
      </div>

      <div className="lp-brief__stage" data-reveal style={{ ["--d" as string]: "120ms" }} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        <div className="lp-brief__media">
          {a.media.type === "video" ? (
            <video key={a.key} src={a.media.src} autoPlay muted loop playsInline />
          ) : (
            <img key={a.key} src={a.media.src} alt="" />
          )}
          <span className="lp-label lp-brief__tag">{isUlt ? "Ultimate" : "Ability"} · {a.key}</span>
          <span key={`k-${a.key}`} className="lp-brief__key">{a.key}</span>
        </div>

        <div className="lp-brief__info">
          <span className="lp-label lp-brief__slot">{a.slot}</span>
          <h3 key={a.key} className="lp-display lp-brief__name">
            {a.name}
            {a.sub && <small>{a.sub}</small>}
          </h3>
          <p className="lp-brief__desc">{a.desc}</p>

          <div className="lp-brief__keys" role="tablist" aria-label="Codezilla highlights">
            {ABILITIES.map((ab, i) => (
              <button
                key={ab.key}
                role="tab"
                aria-selected={i === active}
                className={`lp-key${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="lp-key__cap">{ab.key}</span>
                <span className="lp-key__name">{ab.name}{ab.sub ? ` ${ab.sub}` : ""}</span>
                {ab.key === "X" && (
                  <span className="lp-key__pips"><i /><i /><i /><i /></span>
                )}
                <span
                  className="lp-key__bar"
                  onAnimationEnd={() => setActive((i + 1) % ABILITIES.length)}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Rewards() {
  return (
    <section className="lp-rewards">
      <div className="lp-rewards__inner" data-reveal>
        <p className="lp-label lp-rewards__ep">Codezilla_3.0 // The Spike Rush</p>
        <h2 className="lp-display lp-rewards__title">
          Win Special
          <span>Rewards</span>
        </h2>
      </div>
    </section>
  );
}

function Squad({ onRegister }: { onRegister: () => void }) {
  const slots = [
    { role: "Team Leader", name: "You", note: "Signs in with Google & fills the form", img: imgRaze, tint: "#ff8a3d" },
    { role: "Member 2", name: "Teammate", note: "Details filled in by the leader", img: imgReyna, tint: "#c04cff" },
  ];
  return (
    <section id="squad" className="lp-squad">
      <div className="lp-sec-head" data-reveal>
        <span className="lp-sec-head__index">02</span>
        <h2 className="lp-display lp-sec-head__title">Your Squad</h2>
        <p className="lp-sec-head__sub">3 members. No ifs and doubts about that.</p>
      </div>

      <div className="lp-squad__grid">
        {slots.map((s, i) => (
          <article key={s.role} className="lp-slot" data-reveal style={{ ["--tint" as string]: s.tint, ["--d" as string]: `${i * 120}ms` }}>
            <span className="lp-slot__big">{i + 1}</span>
            <img className="lp-slot__img" src={s.img} alt="" loading="lazy" />
            <div className="lp-slot__meta">
              <span className="lp-label lp-slot__role">{s.role}</span>
              <h3 className="lp-display lp-slot__name">{s.name}</h3>
              <p className="lp-slot__note">{s.note}</p>
            </div>
          </article>
        ))}
        <article className="lp-slot lp-slot--empty" data-reveal style={{ ["--tint" as string]: "#4fe3c1", ["--d" as string]: "240ms" }}>
          <span className="lp-slot__big">3</span>
          <span className="lp-slot__q">?</span>
          <div className="lp-slot__meta">
            <span className="lp-label lp-slot__role">Member 3</span>
            <h3 className="lp-display lp-slot__name">Slot Open</h3>
            <p className="lp-slot__note">Your third teammate goes here.</p>
          </div>
        </article>
      </div>

      <div className="lp-squad__foot" data-reveal>
        <p>Only the team leader fills this form</p>
        <button className="lp-btn lp-btn--red" onClick={onRegister}>
          <span className="lp-btn__sq" /> Register Your Team
        </button>
      </div>
    </section>
  );
}

function Match() {
  const rows = [
    { k: "Date", v: "5th October", n: "Tentative — first or second week of October." },
    { k: "Venue", v: "Labs", n: "Probably offline. If not allotted, online." },
    { k: "Platform", v: "Contest Platform", n: "Yes, you get internet for it." },
    { k: "Team", v: "3 Members", n: "No ifs and doubts about that." },
    { k: "Notes", v: "Handwritten Only", n: "Printed notes might lead to immediate disqualification.", warn: true },
  ];
  return (
    <section id="match" className="lp-match">
      <img className="lp-match__map" src={imgMap} alt="" loading="lazy" />
      <div className="lp-sec-head" data-reveal>
        <span className="lp-sec-head__index">03</span>
        <h2 className="lp-display lp-sec-head__title">Match Info</h2>
      </div>
      <p className="lp-label lp-match__place" data-reveal>
        Map
        <b>IIIT Sonepat</b>
      </p>
      <dl className="lp-match__list">
        {rows.map((r, i) => (
          <div key={r.k} className={`lp-match__row${r.warn ? " lp-match__row--warn" : ""}`} data-reveal style={{ ["--d" as string]: `${i * 70}ms` }}>
            <dt className="lp-label">{r.k}</dt>
            <dd>
              <b>{r.v}</b>
              <span>{r.n}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Comms() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="lp-comms">
      <div className="lp-comms__wrap">
        <div className="lp-comms__lead" data-reveal>
          <div className="lp-sec-head" style={{ marginBottom: 0 }}>
            <span className="lp-sec-head__index">04</span>
            <h2 className="lp-display lp-sec-head__title">FAQs</h2>
          </div>
          <p>Got questions? We've got answers.</p>
        </div>

        <div className="lp-comms__panel" data-reveal style={{ ["--d" as string]: "120ms" }}>
          <div className="lp-comms__bar lp-label">
            <span>Team Comms</span>
            <span>{FAQS.length} msgs</span>
          </div>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`lp-q${isOpen ? " is-open" : ""}`}>
                <button className="lp-q__btn" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="lp-q__idx">{pad(i + 1)}</span>
                  <span className="lp-q__text"><em>(Team)</em>{f.q}</span>
                  <span className="lp-q__plus" />
                </button>
                <div className="lp-q__body">
                  <div>
                    <p className="lp-q__answer"><em>TechSoc:</em>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Powered() {
  return (
    <section id="powered-by" className="lp-powered">
      <p className="lp-label">Powered By</p>
      <div className="lp-powered__logos">
        <img src={imgTechSoci} alt="Technical Society IIIT Sonepat" />
        <img src={imgAlgozenith} alt="Algozenith IIIT Sonepat" />
      </div>
    </section>
  );
}

function Finale({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="lp-finale">
      <video src="/valorant/finale.mp4" autoPlay muted loop playsInline preload="none" />
      <p className="lp-label" data-reveal>Codezilla 3.0 // The Spike Rush</p>
      <h2 className="lp-display lp-finale__title" data-reveal>
        Plant The <span>Spike</span>
      </h2>
      <p className="lp-finale__sub" data-reveal>Register Your Team for Codezilla. Sign in with Google — you'll fill out details for all 3 team members.</p>
      <div className="lp-finale__actions" data-reveal>
        <SpikeButton onPlanted={onRegister} />
        <a className="lp-btn lp-btn--ghost" href={SYLLABUS_URL} target="_blank" rel="noopener noreferrer">
          <span className="lp-btn__sq" /> Syllabus
        </a>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const goRegister = () => navigate("/register");
  useReveal();

  return (
    <div className="lp">
      <Nav onRegister={goRegister} />
      <Hero onRegister={goRegister} />
      <Ticker />
      <Briefing />
      <Rewards />
      <Squad onRegister={goRegister} />
      <Match />
      <Comms />
      <Powered />
      <Finale onRegister={goRegister} />
      <footer className="lp-footer">
        <span>© Codezilla 3.0 · Technical Society IIIT Sonepat</span>
        <nav>
          <a href={SYLLABUS_URL} target="_blank" rel="noopener noreferrer">Syllabus</a>
          <Link to="/register">Register</Link>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId("faq"); }}>FAQs</a>
        </nav>
      </footer>
    </div>
  );
}
