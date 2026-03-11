import { useState } from "react";
import svgPaths from "./svg-2v4llaxhqm";
import iconSvg1 from "../assets/svg1.svg";
import iconSvg2 from "../assets/svg2.svg";
import iconSvg3 from "../assets/svg3.svg";
import imgCtaImage from "../assets/CTA-IMAGE.png";
import imgProfile from "../assets/profile.jpg";
import imgSummerOfCode from "../assets/summer_of_code_logo.png";
import imgWorldQuant from "../assets/worldquant_logo.png";
import imgDualite from "../assets/dualite_logo.png";
import imgAlgozenithLogo from "../assets/algozenith-logo.svg";
import iconGithub from "../assets/github.svg";
import iconLinkedin from "../assets/linkedin.svg";
import iconGmail from "../assets/gmail.svg";
import imgTechSociLogo from "../assets/TechSoci-logo.svg";
import imgGdgLogo from "../assets/gdg_ait_pune_logo.svg";
import imgFrame from "figma:asset/82c4cb5926612e45a942d2f628f6759359c3a158.png";
import imgImage from "figma:asset/5f010b637e91c7aef3621918a9cacf6579c4e805.png";
import imgFrame1 from "figma:asset/e577b92be2ca59ea233ba432fd855acf9283e325.png";
import imgImage1 from "figma:asset/9ea9f1f336c13b9b8333880743ff202c68a392fd.png";
import imgImage2 from "figma:asset/7069df87c3d98a211b5fcb4dd7c5de5f5c1bc61d.png";
import imgEllipse from "figma:asset/c16e896265e08435b86c94a489913b76d84cc258.png";
import imgEllipse1 from "figma:asset/824a83ab642c41c211eeaec2a5a8cc4ca0065567.png";
import imgEllipse2 from "figma:asset/25bad6a1385a9c2f7c7767c966d9639efbbd1ac0.png";
import imgEllipse3 from "figma:asset/fef4cd4ea2142d5e985cbc1abc26907a540e0040.png";

// ─── Decorative background SVGs ──────────────────────────────────────────────

function BgLines() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* horizontal grid lines */}
      <div style={{ position: "absolute", left: -196, top: 5, height: 299, width: 243 }}>
        <svg width="243" height="299" fill="none" viewBox="0 0 244 300">
          <path d={svgPaths.p2d35c540} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: -72, top: 0, height: 309, width: 1703 }}>
        <svg width="1703" height="309" fill="none" viewBox="0 0 1704 310" style={{ transform: "scaleY(-1)" }}>
          <path d={svgPaths.p3b1e3050} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p3be53400} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p79f2180} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p3a7aa500} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p293c4b80} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.pf787540} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p20fbee00} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p5cd7e80} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p1f842b00} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p288553c0} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p916f380} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: -81, top: 229, height: 308, width: 1597 }}>
        <svg width="1597" height="308" fill="none" viewBox="0 0 1598 309">
          <path d={svgPaths.p60abc80} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p13ac5e00} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p1cf4b500} stroke="#B2B2B2" strokeOpacity="0.24" strokeWidth="1" />
          <path d={svgPaths.pedbf700} stroke="#B2B2B2" strokeOpacity="0.5" strokeWidth="1" />
          <path d={svgPaths.p27da0840} stroke="#B2B2B2" strokeOpacity="0.24" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

// ─── Card: Transcript / Image ─────────────────────────────────────────────────

function ImageCard() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        boxShadow: "0 4px 4px rgba(0,0,0,0.10)",
        width: "100%",
        height: "100%",
        minHeight: 340,
      }}
    >
      <img
        alt=""
        src={imgImage}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <img
        alt=""
        src={imgImage}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 58%, rgba(139,125,122,0.34) 100%)",
        }}
      />
      <p
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          fontFamily: "'Neue Montreal', sans-serif",
          fontSize: 28,
          color: "white",
          letterSpacing: "-0.3px",
          lineHeight: 1,
          margin: 0,
        }}
      >
        Win Special Rewards
      </p>
    </div>
  );
}

// ─── Card: Integrations ───────────────────────────────────────────────────────

function IntegrationsCard() {
  return (
    <div
      style={{
        backgroundColor: "#e7e9eb",
        borderRadius: 18,
        boxShadow: "0 4px 4px rgba(0,0,0,0.10), 0 4px 2px rgba(0,0,0,0.08), 0 -2px 14px rgba(0,0,0,0.05)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        height: "100%",
        minHeight: 240,
        boxSizing: "border-box",
      }}
    >
      {/* Icon row */}
      <div style={{ display: "flex", gap: 12 }}>
        {[iconSvg1, iconSvg2, iconSvg3].map((icon, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#f6f6f6",
              borderRadius: 10,
              boxShadow: "0 0 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)",
              width: 54,
              height: 54,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              padding: 10,
              boxSizing: "border-box",
            }}
          >
            <img src={icon} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        ))}
      </div>

      {/* Text — pushed to bottom */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <p
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 28,
            color: "#000",
            letterSpacing: "-0.6px",
            lineHeight: 1,
            margin: 0,
          }}
        >
          Projects That Get Noticed
        </p>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            color: "#4b4d4f",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          Understand what makes a project stand out to recruiters and which ones are high paying startups hiring for?
        </p>
      </div>
    </div>
  );
}

// ─── Card: 83% ────────────────────────────────────────────────────────────────

function Stats83Card() {
  return (
    <div
      style={{
        backgroundColor: "#bcd88f",
        borderRadius: 18,
        boxShadow: "0 4px 4px rgba(0,0,0,0.10), 0 4px 2px rgba(0,0,0,0.08), 0 -2px 14px rgba(0,0,0,0.05)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        minHeight: 240,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 64,
            color: "#000",
            letterSpacing: "-1.4px",
            lineHeight: 0.85,
            margin: 0,
          }}
        >
          96%
        </p>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            color: "#4b4d4f",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          Up to 96% of resumes fail ATS screening even before reaching recruiters.
        </p>
      </div>
    </div>
  );
}

// ─── Card: 2.5B+ ──────────────────────────────────────────────────────────────

function Stats2_5BCard() {
  return (
    <div
      style={{
        backgroundColor: "#e7e9eb",
        borderRadius: 18,
        boxShadow: "0 4px 4px rgba(0,0,0,0.10), 0 4px 2px rgba(0,0,0,0.08), 0 -2px 14px rgba(0,0,0,0.05)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        minHeight: 220,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 64,
            color: "#000",
            letterSpacing: "-1.4px",
            lineHeight: 0.85,
            margin: 0,
          }}
        >
          1M+
        </p>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            color: "#4b4d4f",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          Stand out among millions of applicants with a strong, recruiter-ready resume.
        </p>
      </div>
    </div>
  );
}

// ─── Card: Dark image ─────────────────────────────────────────────────────────

function DarkImageCard() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        boxShadow: "0 4px 4px rgba(0,0,0,0.10)",
        width: "100%",
        height: "100%",
        minHeight: 240,
      }}
    >
      <img
        alt=""
        src={imgImage1}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <img
        alt=""
        src={imgImage1}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "multiply",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

// ─── Card: Automation ─────────────────────────────────────────────────────────

function AutomationCard() {
  return (
    <div
      style={{
        backgroundColor: "#dde5e9",
        borderRadius: 18,
        boxShadow: "0 4px 4px rgba(0,0,0,0.10), 0 4px 2px rgba(0,0,0,0.08), 0 -2px 14px rgba(0,0,0,0.05)",
        padding: 28,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        minHeight: 240,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Decorative right panel */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "55%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Blurred peach ellipse */}
        <svg
          style={{ position: "absolute", right: "-5%", top: "5%", width: "70%" }}
          fill="none"
          viewBox="0 0 529 495"
        >
          <g filter="url(#f_peach)">
            <ellipse cx="264.493" cy="247.088" fill="#F8DDD6" rx="151.234" ry="133.829" />
          </g>
          <defs>
            <filter id="f_peach" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="0" y="0" width="529" height="495">
              <feFlood floodOpacity="0" result="bg" />
              <feBlend in="SourceGraphic" in2="bg" result="shape" />
              <feGaussianBlur stdDeviation="56.63" />
            </filter>
          </defs>
        </svg>
        {/* Blurred blue ellipse */}
        <svg
          style={{ position: "absolute", left: "-5%", top: "8%", width: "80%" }}
          fill="none"
          viewBox="0 0 589 514"
        >
          <g filter="url(#f_blue)">
            <ellipse cx="294.181" cy="256.887" fill="#7EDCFB" rx="180.922" ry="143.627" />
          </g>
          <defs>
            <filter id="f_blue" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="0" y="0" width="589" height="514">
              <feFlood floodOpacity="0" result="bg" />
              <feBlend in="SourceGraphic" in2="bg" result="shape" />
              <feGaussianBlur stdDeviation="56.63" />
            </filter>
          </defs>
        </svg>
        {/* Chess pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.7,
            backgroundImage: `url('${imgImage2}')`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />
        {/* Concentric circles */}
        <div style={{ position: "absolute", right: "-15%", top: "-10%", width: "110%", opacity: 0.8, transform: "rotate(7.34deg)" }}>
          <svg width="100%" viewBox="0 0 694 674" fill="none">
            <circle cx="264.946" cy="264.946" r="264.44" stroke="white" strokeWidth="1" />
            <circle cx="304.384" cy="297.305" r="264.44" stroke="white" strokeWidth="1" />
            <circle cx="341.796" cy="338.768" r="264.44" stroke="white" strokeWidth="1" />
            <circle cx="391.35" cy="382.25" r="264.44" stroke="white" strokeWidth="1" />
            <circle cx="428.767" cy="408.543" r="264.44" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        {/* Avatars */}
        <div style={{ position: "absolute", top: 16, left: "20%", display: "flex", gap: 8 }}>
          <img alt="" src={imgEllipse} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
          <img alt="" src={imgEllipse1} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", top: 72, left: "35%", display: "flex", gap: 8 }}>
          <img alt="" src={imgEllipse2} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
          <img alt="" src={imgEllipse3} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Text */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "'Neue Montreal', sans-serif",
          fontSize: 28,
          color: "#000",
          lineHeight: 1.15,
          letterSpacing: "-0.3px",
          maxWidth: 260,
        }}
      >
        <p style={{ margin: 0 }}>ATS</p>
        <p style={{ margin: 0 }}>Optimized Hiring</p>
        <p style={{ margin: 0 }}>Advantage</p>
      </div>
    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: open ? "#ffffff" : "#fafafa",
        border: `1px solid ${open ? "#e0e0e0" : "#ebebeb"}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          padding: "20px 24px",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: open ? "#000" : "#2b2f33",
            lineHeight: 1.35,
            transition: "color 0.2s",
          }}
        >
          {question}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: open ? "#2b2f33" : "#ececec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.25s, transform 0.25s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1v8M1 5h8"
              stroke={open ? "#fff" : "#555"}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              margin: 0,
              padding: "0 24px 20px",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15,
              color: "#555",
              lineHeight: 1.65,
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

const NAV_LINKS = ["Features", "How it works", "Pricing", "FAQ"];

export default function Component10HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#F8F8F9",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <BgLines />

      {/* ── NAVBAR ───────────────────────────────────────────────────────────── */}
      <nav
        className="samfund-nav"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 48px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <p
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 24,
            color: "#000",
            margin: 0,
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          Workshop
        </p>

        {/* Desktop nav links */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
        >
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, "-")}`}
              style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: 16,
                color: "#4b4d4f",
                textDecoration: "none",
                transition: "color 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4b4d4f")}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Github button */}
        <a
          href="https://github.com/FirePheonix/resume-builder-workshop"
          target="_blank"
          rel="noopener noreferrer"
          className="login-btn"
          style={{
            backgroundColor: "#2b2f33",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 30,
            padding: "10px 22px",
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 16,
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "inset 0 4px 5px rgba(0,0,0,0.1)",
            transition: "background-color 0.15s",
            textDecoration: "none",
            display: "inline-block",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e2226")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2b2f33")}
        >
          Github
        </a>

        {/* Hamburger — shown on mobile via CSS class */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            display: "none",
            flexDirection: "column",
            gap: 5,
            background: "none",
            border: "none",
            padding: 8,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              display: "block",
              width: 24,
              height: 2,
              backgroundColor: "#000",
              transition: "all 0.2s",
              transformOrigin: "center",
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 2,
              backgroundColor: "#000",
              transition: "all 0.2s",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 2,
              backgroundColor: "#000",
              transition: "all 0.2s",
              transformOrigin: "center",
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu — only rendered when menuOpen, CSS hides it on desktop */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "relative",
            zIndex: 10,
            backgroundColor: "#F8F8F9",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            padding: "12px 24px 20px",
            flexDirection: "column",
            display: "flex",
          }}
        >
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: 16,
                color: "#4b4d4f",
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                display: "block",
              }}
            >
              {label}
            </a>
          ))}
          <button
            style={{
              marginTop: 16,
              backgroundColor: "#2b2f33",
              color: "white",
              border: "none",
              borderRadius: 30,
              padding: "12px 22px",
              fontFamily: "'Neue Montreal', sans-serif",
              fontSize: 16,
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            Github
          </button>
        </div>
      )}

      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section
        className="hero-section"
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          padding: "40px 24px 48px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(36px, 5.5vw, 75px)",
            color: "#000",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          Workshop for Building Resumes That Stand Out
        </h1>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: "clamp(15px, 1.2vw, 18px)",
            color: "#4b4d4f",
            lineHeight: 1.3,
            maxWidth: 560,
            margin: "24px auto 0",
          }}
        >
          Engineered to help students build professional resumes, highlight their projects, and stand out to recruiters and internship opportunities.
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdwRRwpUuXy666G8xdwdUHn_jJesADoZVKDd5yWdmnBYqjMUQ/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 32,
            backgroundColor: "#2b2f33",
            color: "white",
            border: "none",
            borderRadius: 30,
            padding: "14px 24px",
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: "clamp(17px, 1.2vw, 20px)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            boxShadow: "inset 0 -4px 20px rgba(0,0,0,0.1), inset 0 4px 20px rgba(0,0,0,0.1)",
            transition: "background-color 0.15s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e2226")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2b2f33")}
        >
          Register Now
          <svg width="18" height="18" viewBox="0 0 25 25" fill="none">
            <path
              d={svgPaths.p3212dec0}
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </a>
      </section>

      {/* ── CARDS GRID ───────────────────────────────────────────────────────── */}
      <section
        className="cards-section"
        style={{
          position: "relative",
          zIndex: 5,
          padding: "0 32px 64px",
          boxSizing: "border-box",
        }}
      >
        {/*
          Desktop 4-col layout:
          ┌──────────┬──────────┬──────────┬──────────┐
          │ Integr.  │          │  83%     │  Dark    │
          │          │  Image   │          │  Card    │
          ├──────────┤  (tall)  ├──────────┴──────────┤
          │  2.5B+   │          │  Automation (wide)  │
          └──────────┴──────────┴─────────────────────┘
        */}
        <div
          className="cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "260px 260px",
            gap: 16,
            maxWidth: "80%",
            margin: "0 auto",
          }}
        >
          {/* Integrations — col1 row1 */}
          <div style={{ gridColumn: 1, gridRow: 1 }}>
            <IntegrationsCard />
          </div>

          {/* Image card (tall) — col2 rows1-2 */}
          <div style={{ gridColumn: 2, gridRow: "1 / 3" }}>
            <ImageCard />
          </div>

          {/* 83% — col3 row1 */}
          <div style={{ gridColumn: 3, gridRow: 1 }}>
            <Stats83Card />
          </div>

          {/* Dark image — col4 row1 */}
          <div style={{ gridColumn: 4, gridRow: 1 }}>
            <DarkImageCard />
          </div>

          {/* 2.5B+ — col1 row2 */}
          <div style={{ gridColumn: 1, gridRow: 2 }}>
            <Stats2_5BCard />
          </div>

          {/* Automation (wide) — col3-4 row2 */}
          <div style={{ gridColumn: "3 / 5", gridRow: 2 }}>
            <AutomationCard />
          </div>
        </div>
      </section>

      {/* ── POWERED BY ──────────────────────────────────────────────────────── */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          width: "80%",
          margin: "0 auto",
          padding: "40px 0 48px",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#aaaaaa",
          }}
        >
          Powered By
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
          <img
            src={imgAlgozenithLogo}
            alt="AlgoZenith"
            style={{ width: "22%", height: "auto", filter: "grayscale(1) opacity(0.45)", objectFit: "contain" }}
          />
          <img
            src={imgTechSociLogo}
            alt="TechSoci"
            style={{ width: "22%", height: "auto", filter: "grayscale(1) opacity(0.45)", objectFit: "contain" }}
          />
          <img
            src={imgGdgLogo}
            alt="GDG AIT Pune"
            style={{ width: "22%", height: "auto", filter: "grayscale(1) opacity(0.45)", objectFit: "contain" }}
          />
        </div>
      </section>

      {/* ── CTA IMAGE ────────────────────────────────────────────────────────── */}
      <section
        className="cta-image-section"
        style={{
          position: "relative",
          zIndex: 5,
          width: "80%",
          margin: "0 auto",
          paddingBottom: 64,
          boxSizing: "border-box",
        }}
      >
        <img
          src={imgCtaImage}
          alt=""
          style={{
            width: "100%",
            display: "block",
          }}
        />
      </section>

      {/* ── KNOW YOUR SPEAKER ────────────────────────────────────────────────── */}
      <section
        style={{
          width: "80%",
          margin: "0 auto",
          paddingBottom: 80,
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: "0 0 32px",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#aaaaaa",
            textAlign: "center",
          }}
        >
          Know Your Speaker
        </h2>

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 2px 40px 0 rgba(0,0,0,0.08)",
            maxWidth: 960,
            margin: "0 auto",
          }}
        >
          {/* Banner */}
          <div
            style={{
              height: 160,
              background: "linear-gradient(120deg, #f0f0f0 0%, #e4e4e4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 48px",
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 32, color: "#2b2f33", letterSpacing: "-0.5px" }}>
              Workshop <span style={{ color: "#6c63ff" }}>2026</span>
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: "0 48px 48px", position: "relative" }}>
            {/* Top row: avatar + name + register */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 0 }}>
              <img
                src={imgProfile}
                alt="Speaker"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #ffffff",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.14)",
                  marginTop: -60,
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdwRRwpUuXy666G8xdwdUHn_jJesADoZVKDd5yWdmnBYqjMUQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#2b2f33",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: 4,
                  position: "relative",
                  zIndex: 10,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1e2226")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2b2f33")}
              >
                Register
              </a>
            </div>

            {/* Name + tagline */}
            <h3 style={{ margin: "20px 0 4px", fontSize: 34, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
              Shubham Singh
            </h3>
            <p style={{ margin: "0 0 8px", fontSize: 16, color: "#888" }}>
              Founder &nbsp;·&nbsp; Researcher &nbsp;·&nbsp; Open Source Contributor
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
              {[
                { icon: iconGithub, href: "https://github.com/FirePheonix", label: "GitHub" },
                { icon: iconLinkedin, href: "https://www.linkedin.com/in/shubham-singh-8a5643198/", label: "LinkedIn" },
                { icon: iconGmail, href: "mailto:shubhsoch@gmail.com", label: "Email" },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: "#f4f4f5",
                    border: "1px solid #e4e4e7",
                    transition: "background 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#e9e9ec")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f4f4f5")}
                >
                  <img src={icon} alt={label} style={{ width: 18, height: 18, objectFit: "contain" }} />
                </a>
              ))}
            </div>

            {/* Logo row */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
              {[
                { src: imgSummerOfCode, alt: "Google Summer of Code" },
                { src: imgWorldQuant, alt: "WorldQuant" },
                { src: imgDualite, alt: "Dualite" },
              ].map(({ src, alt }) => (
                <img
                  key={alt}
                  src={src}
                  alt={alt}
                  style={{ height: 64, width: "auto", objectFit: "contain", opacity: 0.85 }}
                />
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#f0f0f0", marginBottom: 24 }} />

            {/* Bio paragraphs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontSize: 15,
                color: "#555",
                lineHeight: 1.6,
                fontFamily: "'Inter Tight', sans-serif",
              }}
            >
              <p style={{ margin: 0 }}>
                Hi, I'm Shubham, a developer who enjoys building things, contributing to open source, and experimenting with new ideas in tech.
              </p>
              <p style={{ margin: 0 }}>
                I was selected as a <strong style={{ color: "#333" }}>Google Summer of Code 2025</strong> contributor with Sugar Labs, where I worked with a global open-source team and collaborated on developing projects for their platform. I am currently a maintainer of a Sugar Labs repo and an active open source contributor.
              </p>
              <p style={{ margin: 0 }}>
                Alongside open source, I currently work as a <strong style={{ color: "#333" }}>Quant Research Consultant at WorldQuant</strong>, exploring the intersection of data, mathematics, and financial research.
              </p>
              <p style={{ margin: 0 }}>
                I also enjoy building products. Recently I've been working on <strong style={{ color: "#333" }}>Gemnar</strong>, an AI workflow platform that lets creators automate content generation and distribution using multiple AI models through visual pipelines.
              </p>
              <p style={{ margin: 0 }}>
                Over time I've participated in several hackathons and placed in a few, including <strong style={{ color: "#333" }}>Infosys CAI Hackathon</strong>, <strong style={{ color: "#333" }}>HackOrbit</strong>, and <strong style={{ color: "#333" }}>Hackzilla</strong>. Outside of coding, I've had the opportunity to speak with developer communities, including a session at <strong style={{ color: "#333" }}>IIT Madras</strong>.
              </p>
              <p style={{ margin: 0 }}>
                I've also worked with startups, including <strong style={{ color: "#333" }}>Dualite</strong>, an AI website-building platform in the Figma-to-code space, where I gained exposure to building real products in fast-paced environments.
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: "#f0f0f0", margin: "4px 0" }} />

              <p style={{ margin: 0, color: "#6c63ff", fontWeight: 600, fontSize: 14 }}>
                In this session, I'll be sharing practical ideas on how to build and present a resume that actually stands out — based on my own experiences with open source, hackathons, and internships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        style={{
          width: "80%",
          maxWidth: 760,
          margin: "0 auto",
          paddingBottom: 100,
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#aaaaaa",
            textAlign: "center",
          }}
        >
          FAQ
        </h2>
        <p
          style={{
            margin: "0 0 36px",
            textAlign: "center",
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#1a1a1a",
            letterSpacing: "-0.4px",
          }}
        >
          Got questions? We've got answers.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              q: "Is this an online live session?",
              a: "Yes — this is a fully online, live interactive session. You'll be able to ask questions in real time and engage directly with the speaker.",
            },
            {
              q: "Will resources and recordings be shared?",
              a: "Absolutely. All registered attendees will receive the session recording, slide deck, and any additional resources shared during the workshop — so you won't miss a thing even if you can't make it live.",
            },
            {
              q: "When exactly is the session?",
              a: "The exact date and time will be emailed to you shortly after registration. The session is planned for the evening, so it should be convenient for most students.",
            },
            {
              q: "What kind of projects will be covered?",
              a: "The session will focus on industry-relevant projects — the kind that actually get noticed by recruiters. These are real-world project ideas sourced in collaboration with industry professionals, covering domains like open source, AI/ML, and full-stack development.",
            },
          ].map(({ q, a }, i) => (
            <FaqItem key={i} question={q} answer={a} />
          ))}
        </div>
      </section>

      {/* ── RESPONSIVE STYLES ────────────────────────────────────────────────── */}
      <style>{`
        /* tablet — 2-col, full width */
        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: auto !important;
            gap: 12px !important;
            max-width: 100% !important;
          }
          .cards-grid > div {
            grid-column: auto !important;
            grid-row: auto !important;
            min-height: 240px;
          }
        }

        /* phone — 1-col, full width, hide CTA */
        @media (max-width: 640px) {
          .samfund-nav {
            padding: 14px 20px !important;
          }
          .desktop-nav,
          .login-btn {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
          .mobile-menu {
            display: flex !important;
          }
          .hero-section {
            padding: 28px 20px 36px !important;
          }
          .cards-section {
            padding: 0 16px 48px !important;
          }
          .cards-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            max-width: 100% !important;
          }
          .cards-grid > div {
            min-height: 220px;
          }
          .cta-image-section {
            display: none !important;
          }
        }

        /* always hide mobile menu on desktop */
        @media (min-width: 641px) {
          .mobile-menu {
            display: none !important;
          }
          .hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
