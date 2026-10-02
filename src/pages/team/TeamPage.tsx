import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AGENT_BY_NAME } from "../register/agents";
import { fetchTeam, getSavedTeam, saveTeam, TeamNotFoundError, UNSTOP_URL, type PublicTeam } from "../../lib/team";
import { drawCardAtlas, drawStrap } from "./cardArt";
import "../landing/landing.css";
import "./team.css";

const loadLanyard = () => import("./Lanyard");
const Lanyard = lazy(loadLanyard);

type Art = { atlas: HTMLCanvasElement; strap: HTMLCanvasElement };

export default function TeamPage() {
  const { slug } = useParams();
  if (!slug) {
    const saved = getSavedTeam();
    return saved ? <Navigate to={`/team/${saved.slug}`} replace /> : <NoTeam />;
  }
  return <TeamPass key={slug} slug={slug} />;
}

function TeamPass({ slug }: { slug: string }) {
  const location = useLocation();
  const fresh = (location.state as { fresh?: boolean } | null)?.fresh ?? false;
  const [team, setTeam] = useState<PublicTeam | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [art, setArt] = useState<Art | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const toasted = useRef(false);

  useEffect(() => {
    loadLanyard();
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    fetchTeam(slug, ctrl.signal)
      .then((t) => {
        setTeam(t);
        setStatus("ready");
      })
      .catch((err) => {
        if (ctrl.signal.aborted) return;
        setStatus(err instanceof TeamNotFoundError ? "missing" : "error");
      });
    return () => ctrl.abort();
  }, [slug, attempt]);

  useEffect(() => {
    if (!team) return;
    let alive = true;
    document.title = `${team.teamName} · Team Pass · Codezilla 3.0`;
    drawCardAtlas(team).then((atlas) => {
      if (alive) setArt({ atlas, strap: drawStrap() });
    });
    if (fresh && !toasted.current) {
      toasted.current = true;
      saveTeam(team);
      toast.success("Registration complete", { description: `${team.teamName} is locked in. Here's your team pass.` });
    }
    return () => {
      alive = false;
    };
  }, [team, fresh]);

  const copyLink = async () => {
    const url = `${window.location.origin}/team/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Team link copied", { description: url });
    } catch {
      toast("Copy failed", { description: url });
    }
  };

  if (status === "missing") return <Missing slug={slug} />;
  if (status === "error")
    return (
      <Shell>
        <div className="tp-empty">
          <span className="tp-kicker">Connection lost</span>
          <h1 className="tp-empty__title">Couldn't load this team pass</h1>
          <p className="tp-empty__copy">The server didn't answer. Check your connection and try again.</p>
          <div className="tp-actions">
            <button className="tp-btn tp-btn--red" onClick={() => setAttempt((n) => n + 1)}>
              Retry
            </button>
            <Link className="tp-btn" to="/">
              Home
            </Link>
          </div>
        </div>
      </Shell>
    );

  return (
    <Shell>
      <section className="tp-info">
        {status === "loading" || !team ? (
          <div className="tp-loading" aria-live="polite">
            <span className="tp-kicker">Team pass</span>
            <div className="tp-skel tp-skel--title" />
            <div className="tp-skel" />
            <div className="tp-skel tp-skel--short" />
          </div>
        ) : (
          <>
            {fresh && (
              <div className="tp-banner" role="status">
                <i>✓</i>
                <div>
                  <b>Registration locked in.</b> This is your squad's pass. Bookmark it or share the link with your team.
                </div>
              </div>
            )}
            <span className="tp-kicker">
              Team pass <em>//</em> No. {String(team.number).padStart(3, "0")}
            </span>
            <h1 className="tp-title">{team.teamName}</h1>
            <p className="tp-sub">
              Cleared for <b>Codezilla 3.0 — The Spike Rush</b>. Registered{" "}
              {new Date(team.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.
            </p>

            <ol className="tp-roster">
              {team.members.map((m, i) => {
                const agent = AGENT_BY_NAME.get(m.agent);
                return (
                  <li key={m.role} className="tp-member" style={{ ["--a" as string]: agent?.colors[0] ?? "#ff4655" }}>
                    <span className="tp-member__icon">{agent && <img src={agent.icon} alt="" loading="lazy" />}</span>
                    <span className="tp-member__body">
                      <span className="tp-member__role">
                        0{i + 1} / {m.role}
                      </span>
                      <span className="tp-member__name">{m.name}</span>
                      <span className="tp-member__agent">
                        {m.agent}
                        {agent && <> · {agent.role}</>}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="tp-actions">
              <button className="tp-btn tp-btn--red" onClick={() => setFlipped((f) => !f)}>
                {flipped ? "Show front" : "Flip card"}
              </button>
              <button className="tp-btn" onClick={copyLink}>
                Copy team link
              </button>
            </div>
            <p className="tp-note">
              Your Unstop team name must match <b>{team.teamName}</b> exactly.{" "}
              <a href={UNSTOP_URL} target="_blank" rel="noreferrer">
                Open Unstop ↗
              </a>
            </p>
          </>
        )}
      </section>

      <section className="tp-stage" aria-label="Team ID card. Drag to swing, tap to flip.">
        <div className="tp-stage__ghost" aria-hidden>
          {team?.teamName ?? "Team pass"}
        </div>
        {art && (
          <Suspense fallback={null}>
            <div className="tp-canvas">
              <Lanyard atlas={art.atlas} strap={art.strap} flipped={flipped} onTap={() => setFlipped((f) => !f)} />
            </div>
          </Suspense>
        )}
        <span className="tp-hint">Drag the card · Tap to flip</span>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="tp">
      <header className="tp-top">
        <Link to="/" className="tp-brand">
          <span className="tp-brand__mark" />
          Codezilla 3.0
        </Link>
        <span className="tp-top__tag">The Spike Rush · IIIT Sonepat</span>
      </header>
      <div className="tp-grid">{children}</div>
    </main>
  );
}

function Missing({ slug }: { slug: string }) {
  return (
    <Shell>
      <div className="tp-empty">
        <span className="tp-kicker">404 // No signal</span>
        <h1 className="tp-empty__title">No team at /team/{slug}</h1>
        <p className="tp-empty__copy">Check the link, or register your squad if you haven't yet.</p>
        <div className="tp-actions">
          <Link className="tp-btn tp-btn--red" to="/register">
            Register a team
          </Link>
          <Link className="tp-btn" to="/">
            Home
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function NoTeam() {
  return (
    <Shell>
      <div className="tp-empty">
        <span className="tp-kicker">Team pass</span>
        <h1 className="tp-empty__title">No team pass yet</h1>
        <p className="tp-empty__copy">
          Register your squad to get your team ID card. Signed up before on another device? Sign in on the register page and
          we'll bring you straight here.
        </p>
        <div className="tp-actions">
          <Link className="tp-btn tp-btn--red" to="/register">
            Register / sign in
          </Link>
          <Link className="tp-btn" to="/">
            Home
          </Link>
        </div>
      </div>
    </Shell>
  );
}
