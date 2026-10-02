import { Link, useLocation, Navigate } from "react-router-dom";
import { AGENT_BY_NAME } from "./register/agents";
import "./landing/landing.css";
import "./thank-you.css";

interface ThankYouState {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  member2Name: string;
  member3Name: string;
  leaderAgent?: string;
  member2Agent?: string;
  member3Agent?: string;
}

export default function ThankYouPage() {
  const state = useLocation().state as ThankYouState | null;
  if (!state) return <Navigate to="/register" replace />;

  const members = [
    { role: "Team Leader", name: state.leaderName, agent: state.leaderAgent },
    { role: "Member 2", name: state.member2Name, agent: state.member2Agent },
    { role: "Member 3", name: state.member3Name, agent: state.member3Agent },
  ].map((m) => ({ ...m, info: m.agent ? AGENT_BY_NAME.get(m.agent) : undefined }));

  return (
    <div className="lp ty">
      <video className="ty__video" src="/valorant/finale.mp4" autoPlay muted loop playsInline />
      <header className="ty__bar">
        <Link to="/" className="lp-logo">
          <span className="lp-logo__mark">CZ</span>
          <span className="lp-logo__text">Codezilla <b>3.0</b></span>
        </Link>
      </header>

      <main className="ty__main">
        <p className="lp-label ty__eyebrow">Registration Complete</p>
        <h1 className="lp-display ty__title">
          Match <span>Found</span>
        </h1>
        <p className="ty__lead">
          Thank you so much for registering! Your response has been recorded via <b>{state.leaderEmail}</b>. You must've received an
          email — or will very soon receive a mail with your identity pass.
        </p>

        <p className="lp-label ty__team-label">Your Team</p>
        <h2 className="lp-display ty__team">{state.teamName}</h2>

        <div className="ty__squad">
          {members.map((m, i) => (
            <article
              key={m.role}
              className="ty__card"
              style={m.info ? { ["--c1" as string]: m.info.colors[0], ["--c2" as string]: m.info.colors[1], ["--d" as string]: `${i * 140}ms` } : { ["--d" as string]: `${i * 140}ms` }}
            >
              {m.info && <img className="ty__portrait" src={m.info.portrait} alt="" />}
              <div className="ty__meta">
                <span className="lp-label">{m.role}</span>
                <b>{m.name}</b>
                {m.info && <span className="ty__agent"><img src={m.info.roleIcon} alt="" />{m.info.name}</span>}
              </div>
            </article>
          ))}
        </div>

        <Link to="/" className="lp-btn lp-btn--red ty__home">
          <span className="lp-btn__sq" /> Back to Home
        </Link>
      </main>
    </div>
  );
}
