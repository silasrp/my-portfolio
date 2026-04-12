/**
 * AI/ML Engineer Portfolio — React Component
 * ─────────────────────────────────────────────
 * Drop this into a Vite + React project:
 *   npm create vite@latest my-portfolio -- --template react
 *   cd my-portfolio && npm install
 *   Replace src/App.jsx content with: import Portfolio from './Portfolio'; export default function App() { return <Portfolio />; }
 *   npm run dev
 *
 * Customise: Search for "EDIT:" comments to find every placeholder.
 */

import { useState, useEffect, useRef } from "react";

// ─── Google Fonts ──────────────────────────────────────────────────────────────
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap');
`;

// ─── Global Styles ─────────────────────────────────────────────────────────────
const STYLES = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg:           #06060E;
    --bg-2:         #0C0C1A;
    --bg-card:      rgba(255,255,255,0.025);
    --accent:       #4AFFC4;
    --accent-glow:  rgba(74,255,196,0.18);
    --accent-dim:   rgba(74,255,196,0.08);
    --pink:         #FF6B8A;
    --yellow:       #FFD166;
    --blue:         #4A9FFF;
    --text:         #E2E2F0;
    --muted:        rgba(226,226,240,0.42);
    --border:       rgba(255,255,255,0.07);
    --border-a:     rgba(74,255,196,0.22);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5 { font-family: 'Syne', sans-serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent-glow); border-radius: 2px; }
  ::selection { background: var(--accent-glow); color: var(--accent); }

  /* ── Nav Links ── */
  .nav-link {
    color: var(--muted);
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    transition: color 0.2s;
    position: relative;
    padding-bottom: 2px;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 1px;
    background: var(--accent);
    transition: width 0.25s;
  }
  .nav-link:hover { color: var(--accent); }
  .nav-link:hover::after { width: 100%; }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-block;
    background: var(--accent);
    color: #06060E;
    padding: 0.75rem 2rem;
    border: none;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    position: relative;
  }
  .btn-primary:hover {
    background: #fff;
    box-shadow: 0 0 30px var(--accent-glow), 0 0 60px var(--accent-glow);
    transform: translateY(-2px);
  }

  .btn-ghost {
    display: inline-block;
    background: transparent;
    color: var(--accent);
    padding: 0.73rem 1.9rem;
    border: 1px solid var(--border-a);
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.22s;
  }
  .btn-ghost:hover {
    background: var(--accent-dim);
    border-color: var(--accent);
    box-shadow: 0 0 20px var(--accent-glow);
    transform: translateY(-2px);
  }

  /* ── Project Cards ── */
  .proj-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 1.75rem;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    color: inherit;
  }
  .proj-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    transform: scaleX(0);
    transition: transform 0.35s;
  }
  .proj-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(74,255,196,0.06), transparent);
    opacity: 0;
    transition: opacity 0.35s;
  }
  .proj-card:hover {
    border-color: var(--border-a);
    transform: translateY(-5px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--border-a);
  }
  .proj-card:hover::before { transform: scaleX(1); }
  .proj-card:hover::after  { opacity: 1; }

  /* ── Skill Tags ── */
  .stag {
    display: inline-block;
    padding: 0.28rem 0.7rem;
    border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    color: var(--muted);
    background: transparent;
    transition: all 0.18s;
    cursor: default;
  }
  .stag:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-dim);
  }

  /* ── Tech Badge (in project cards) ── */
  .tbadge {
    display: inline-block;
    padding: 0.2rem 0.55rem;
    background: rgba(74,255,196,0.07);
    border: 1px solid rgba(74,255,196,0.16);
    color: rgba(74,255,196,0.75);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.03em;
  }

  /* ── Section Label ── */
  .slabel {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1.25rem;
  }
  .slabel::after {
    content: '';
    display: block;
    width: 36px;
    height: 1px;
    background: var(--accent);
    opacity: 0.6;
  }

  /* ── Grid background ── */
  .gridbg {
    background-image:
      linear-gradient(rgba(74,255,196,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74,255,196,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Animations ── */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes blink {
    0%,49% { opacity: 1; }
    50%,100% { opacity: 0; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes scanline {
    from { transform: translateY(-100%); }
    to   { transform: translateY(100vh); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  .anim-in-1 { animation: fadeInUp 0.85s 0.1s both; }
  .anim-in-2 { animation: fadeInUp 0.85s 0.25s both; }
  .anim-in-3 { animation: fadeInUp 0.85s 0.4s both; }
  .anim-in-4 { animation: fadeInUp 0.85s 0.58s both; }
  .anim-in-5 { animation: fadeInUp 0.85s 0.78s both; }
  .anim-in-6 { animation: fadeIn 1s 1.2s both; }

  .cursor-blink { animation: blink 1s infinite; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .about-grid  { grid-template-columns: 1fr !important; gap: 3rem !important; }
    .proj-grid   { grid-template-columns: 1fr !important; }
    .skill-grid  { grid-template-columns: 1fr 1fr !important; }
    .nav-desktop { display: none !important; }
    .nav-mobile  { display: flex !important; }
    .hero-pad    { padding: 0 1.5rem !important; }
    .section-pad { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
  }
  @media (max-width: 600px) {
    .skill-grid { grid-template-columns: 1fr !important; }
    .stats-row  { gap: 1.5rem !important; }
  }
`;

// ─── Neural Network Canvas ─────────────────────────────────────────────────────
function NeuralCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let nodes = [];
    let initialised = false;

    // Called once we have real pixel dimensions
    const init = (w, h) => {
      canvas.width  = w;
      canvas.height = h;
      const count = Math.min(75, Math.floor((w * h) / 9000));
      nodes = Array.from({ length: count }, () => ({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:  Math.random() * 1.4 + 0.4,
        p:  Math.random() * Math.PI * 2,
      }));
    };

    // Resize: keep canvas resolution in sync but preserve node positions proportionally
    const resize = (w, h) => {
      const scaleX = w / (canvas.width  || 1);
      const scaleY = h / (canvas.height || 1);
      canvas.width  = w;
      canvas.height = h;
      nodes.forEach((n) => { n.x *= scaleX; n.y *= scaleY; });
    };

    // ResizeObserver gives us real rendered dimensions after first paint
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (!width || !height) return;
      if (!initialised) {
        init(width, height);
        initialised = true;
        tick();
      } else {
        resize(width, height);
      }
    });
    ro.observe(canvas);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          const max  = 130;
          if (dist < max) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(74,255,196,${(1 - dist / max) * 0.22})`;
            ctx.lineWidth   = (1 - dist / max) * 0.7;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        n.p += 0.018;
        const pr = n.r + Math.sin(n.p) * 0.45;

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 5);
        g.addColorStop(0, "rgba(74,255,196,0.55)");
        g.addColorStop(1, "rgba(74,255,196,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, pr * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74,255,196,0.85)";
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      raf = requestAnimationFrame(tick);
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}
    />
  );
}

// ─── Typing Effect Hook ────────────────────────────────────────────────────────
function useTyping(words, typingSpeed = 80, deletingSpeed = 40, pauseMs = 2200) {
  const [display, setDisplay]   = useState("");
  const [wordIdx, setWordIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;

    if (!deleting && display.length < current.length) {
      timeout = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), typingSpeed);
    } else if (!deleting && display.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && display.length > 0) {
      timeout = setTimeout(() => setDisplay(display.slice(0, -1)), deletingSpeed);
    } else if (deleting && display.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [display, deleting, wordIdx, words, typingSpeed, deletingSpeed, pauseMs]);

  return display;
}

// ─── Data ──────────────────────────────────────────────────────────────────────
// EDIT: Replace all placeholder data below with your real projects, skills, and info.

const PROJECTS = [
  {
    id: "01",
    title: "RAG Pipeline",
    desc:  "A retrieval-augmented generation pipeline that lets you ask natural language questions over technical documentation and get accurate, context-grounded answers in real time. Built with a pgvector database for semantic search and OpenAI embeddings for document retrieval.",
    tags:  ["LangChain", "FastAPI", "Next.js", "pgvector", "OpenAI"],
    link:  "https://rag-project-gamma.vercel.app/",
    status: "Active",
  },
  {
    id: "02",
    title: "Prompt Evaluation Playground",
    desc:  "Prompt engineering is measurable, not just intuitive. This workbench lets you apply six strategies and run them against real OpenAI models, then score every response across four quality dimensions using a second AI acting as an impartial judge.",
    tags:  ["LLM Workflows", "React + Vite", "OpenAI API", "Vercel", "Node.js", "Upstash Redis"],
    link:  "https://prompt-eval-lab.vercel.app/",
    status: "Active",
  },  
  {
    id: "03",
    title: "CodeLens — Codebase Intelligence Platform",
    desc:  "CodeLens analyses GitHub repositories using a multi-stage pipeline that combines code parsing, dependency graphs, and LLMs to generate structured documentation and architecture insights. Built with FastAPI, AWS, and a vector search layer for natural language exploration.",
    tags:  ["FastAPI", "OpenAI API", "Voyage AI", "Qdrant", "AWS Lambda", "SQS", "DynamoDB", "S3"],
    link:  "http://codelens-frontend-017562255303.s3-website.eu-west-2.amazonaws.com/",
    status: "Active",
  },  

];

const STATUS_COLORS = {
  Production:   "#4AFFC4",
  Active:       "#4A9FFF",
  Research:     "#FF6B8A",
  Experimental: "#FFD166",
};

const SKILLS = {
  "Software Engineering": ["C#", ".NET", "Python", "API Design", "Microservices", "Systems Integration"	],
  "Backend & Data": ["SQL Server", "Oracle", "ElasticSearch", "Chroma DB", "pgvector"],
  "Web": ["JavaScript", "Vue.js", "React", "Angular", "HTML", "CSS"],
  "Architecture & Delivery": ["Systems Design", "Agile/Scrum", "Technical Leadership", "Mentoring"],
  "AI & LLMs": ["Prompt Engineering", "LLM Workflows", "Agent-Based Systems", "AI API Integration"],
  "Tools & Practices": ["Docker", "Git", "JIRA", "Agile Methodologies"]

};

const SPECIALISATIONS = [
  "LLM Applications & Agents",
  "Prompt Engineering",
  "AI-Assisted Development",
  "System Integration with AI",
  "RAG Pipelines",
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const typed = useTyping(["Systems Engineer", "AI in Practice", "Builder", "Data & Integrations"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#projects", label: "projects" },
    { href: "#about",    label: "about"    },
    { href: "#skills",   label: "skills"   },
    { href: "#contact",  label: "contact"  },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{FONTS + STYLES}</style>

      {/* ── NAV ───────────────────────────────────────────────────────────────── */}
      <nav style={{
        position:    "fixed",
        top:         0, left: 0, right: 0,
        zIndex:      1000,
        padding:     "1.2rem 3rem",
        display:     "flex",
        justifyContent: "space-between",
        alignItems:  "center",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: "blur(24px)",
        background:  scrolled ? "rgba(6,6,14,0.92)" : "transparent",
        transition:  "all 0.3s",
      }}>
        {/* Logo — EDIT: your name / handle */}
        <a href="#home" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "0.88rem",
            color:         "var(--accent)",
            letterSpacing: "0.16em",
          }}>
            &lt;SilasPereira /&gt;
          </span>
        </a>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
          {/* EDIT: your GitHub URL */}
          <a href="https://github.com/silasrp/" target="_blank" rel="noopener noreferrer" className="btn-ghost"
            style={{ padding: "0.5rem 1.2rem", fontSize: "0.72rem" }}>
            GitHub ↗
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display:    "none",
            background: "none",
            border:     "none",
            cursor:     "pointer",
            flexDirection: "column",
            gap:        "5px",
            padding:    "4px",
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: "block",
              width:   "22px",
              height:  "1.5px",
              background: "var(--text)",
              transition: "all 0.2s",
              transformOrigin: "center",
              transform: mobileOpen
                ? i === 0 ? "rotate(45deg) translate(4.5px, 4.5px)"
                : i === 2 ? "rotate(-45deg) translate(4.5px, -4.5px)"
                : "scaleX(0)"
                : "none",
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position:   "fixed",
          top:        0, left: 0, right: 0, bottom: 0,
          zIndex:     999,
          background: "rgba(6,6,14,0.97)",
          display:    "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap:        "2.5rem",
        }}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link"
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: "1.5rem", letterSpacing: "0.12em" }}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="gridbg"
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        <NeuralCanvas />

        {/* Radial vignette */}
        <div style={{
          position:       "absolute", inset: 0, pointerEvents: "none",
          background:     "radial-gradient(ellipse 90% 70% at 55% 45%, transparent 20%, rgba(6,6,14,0.7) 70%, var(--bg) 100%)",
        }} />

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", pointerEvents: "none",
          background: "linear-gradient(transparent, var(--bg))",
        }} />

        {/* Content */}
        <div className="hero-pad" style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto", padding: "0 3rem", width: "100%",
        }}>
          <div className="anim-in-1" style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem",
            color: "var(--accent)", letterSpacing: "0.22em", marginBottom: "1.5rem",
          }}>
            // hello, world
          </div>

          {/* EDIT: Your name */}
          <h1 className="anim-in-2" style={{
            fontSize:      "clamp(3.2rem, 5vw, 7.5rem)",
            fontWeight:    800,
            lineHeight:    0.95,
            letterSpacing: "-0.025em",
            marginBottom:  "1.5rem",
            color:         "var(--text)",
          }}>
            Silas<br />
            <span style={{ color: "var(--accent)" }}>Pereira</span>
          </h1>

          {/* Typing subtitle */}
          <div className="anim-in-3" style={{
            fontFamily:   "'JetBrains Mono', monospace",
            fontSize:     "clamp(1rem, 2.5vw, 1.5rem)",
            marginBottom: "2rem",
            minHeight:    "2.2rem",
            color:        "var(--muted)",
          }}>
            <span style={{ color: "var(--accent)" }}>&gt; </span>
            <span style={{ color: "var(--text)" }}>{typed}</span>
            <span className="cursor-blink" style={{ color: "var(--accent)" }}>_</span>
          </div>

          {/* EDIT: Your tagline */}
          <p className="anim-in-4" style={{
            maxWidth:     "520px",
            lineHeight:   1.75,
            color:        "var(--muted)",
            marginBottom: "3rem",
            fontSize:     "1.05rem",
            fontWeight:   300,
          }}>
            Software engineer exploring how AI fits into real-world engineering — turning AI from demos into working software.
          </p>

          <div className="anim-in-5" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact"  className="btn-ghost">Get In Touch</a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="anim-in-6" style={{
          position:      "absolute",
          bottom:        "2.5rem",
          left:          "50%",
          transform:     "translateX(-50%)",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           "0.5rem",
          color:         "var(--muted)",
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "0.62rem",
          letterSpacing: "0.2em",
        }}>
          SCROLL
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(var(--accent), transparent)" }} />
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────────────────────── */}
      <section id="projects" style={{ padding: "8rem 0" }}>
        <div className="section-pad" style={{ maxWidth: "1200px", margin: "0 auto", paddingLeft: "3rem", paddingRight: "3rem" }}>
          <div className="slabel">Projects</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.05, color: "var(--text)" }}>
              What I've <span style={{ color: "var(--accent)" }}>Built</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: "360px", lineHeight: 1.7, fontWeight: 300, fontSize: "0.95rem" }}>
              Live experiments and production systems — each hosted externally. Click any card to explore.
            </p>
          </div>

          <div
            className="proj-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
          >
            {PROJECTS.map((p) => (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="proj-card">
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.12em" }}>
                    {p.id}
                  </span>
                  <span style={{
                    fontFamily:   "'JetBrains Mono', monospace",
                    fontSize:     "0.6rem",
                    padding:      "0.18rem 0.55rem",
                    border:       `1px solid ${STATUS_COLORS[p.status]}44`,
                    color:        STATUS_COLORS[p.status],
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background:   `${STATUS_COLORS[p.status]}0D`,
                  }}>
                    {p.status}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: "0.75rem" }}>
                  {p.title}
                </h3>

                <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.75, fontWeight: 300, flexGrow: 1, marginBottom: "1.5rem" }}>
                  {p.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.25rem" }}>
                  {p.tags.map((t) => <span key={t} className="tbadge">{t}</span>)}
                </div>

                <div style={{
                  display:       "flex",
                  justifyContent: "space-between",
                  alignItems:    "center",
                  color:         p.status === "Active" ? "var(--accent)" : "gray",
                  opacity:       p.status === "Active" ? 1 : 0.5,
                  pointerEvents: p.status === "Active" ? "auto" : "none",                                    
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:      "0.7rem",
                  letterSpacing: "0.12em",
                }}>
                  <span>{p.status === "Active" ? "VIEW PROJECT" : "COMING SOON"}</span>
                  <span>↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────────── */}
      <section
        id="about"
        style={{ padding: "8rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}
      >
        <div
          className="about-grid section-pad"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7rem", alignItems: "center" }}
        >
          {/* Left — bio */}
          <div>
            <div className="slabel">About</div>

            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "2rem", lineHeight: 1.1, color: "var(--text)"  }}>
              Engineering at the<br />
              <span style={{ color: "var(--accent)" }}>Edge of AI</span>
            </h2>

            {/* EDIT: Your bio — 2-3 short paragraphs */}
            {[
              "I’m a software engineer and team lead with over a decade of experience working on complex systems in financial technology. My background is in front and backend development, data integration, and keeping critical systems running and evolving in demanding environments.",
              "I’m currently transitioning into AI-focused work, with a practical interest in how large language models and agent-based workflows can be applied beyond demos. I’ve been experimenting with these tools and bringing them into real-world use cases, aiming to build systems that are not just innovative, but reliable and useful in practice.",
            ].map((t, i) => (
              <p key={i} style={{ color: "var(--muted)", lineHeight: 1.85, fontWeight: 300, fontSize: "1rem", marginBottom: "1rem" }}>
                {t}
              </p>
            ))}

            {/* EDIT: your stats */}
            <div className="stats-row" style={{ marginTop: "2.5rem", display: "flex", gap: "3rem", flexWrap: "wrap" }}>
              {[["10+ years", "in Software Engineering"], ["5+ years", "leading a distributed global team"], ["1.5 years", "exploring AI"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.8rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{n}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginTop: "0.3rem", letterSpacing: "0.08em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative specialisation panel */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "340px" }}>
              {/* Corner accents */}
              {[
                { top: "-5px",    left: "-5px"   },
                { top: "-5px",    right: "-5px"  },
                { bottom: "-5px", left: "-5px"   },
                { bottom: "-5px", right: "-5px"  },
              ].map((pos, i) => (
                <div key={i} style={{ position: "absolute", ...pos, width: "12px", height: "12px", background: "var(--accent)" }} />
              ))}

              <div style={{ border: "1px solid var(--border-a)", padding: "2rem" }}>
                <div style={{
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:      "0.68rem",
                  color:         "var(--accent)",
                  letterSpacing: "0.2em",
                  marginBottom:  "1.5rem",
                  textTransform: "uppercase",
                }}>
                  Currently Exploring
                </div>

                {SPECIALISATIONS.map((s, i) => (
                  <div key={s} style={{
                    padding:       "0.7rem 0",
                    borderBottom:  i < SPECIALISATIONS.length - 1 ? "1px solid var(--border)" : "none",
                    color:         "var(--muted)",
                    fontSize:      "0.9rem",
                    fontWeight:    300,
                    display:       "flex",
                    alignItems:    "center",
                    gap:           "0.75rem",
                    transition:    "color 0.2s",
                  }}>
                    <span style={{ color: "var(--accent)", fontSize: "0.5rem" }}>◆</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────────────────────── */}
      <section id="skills" style={{ padding: "8rem 0" }}>
        <div className="section-pad" style={{ maxWidth: "1200px", margin: "0 auto", paddingLeft: "3rem", paddingRight: "3rem" }}>
          <div className="slabel">Stack</div>

          <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "4rem", lineHeight: 0.70, color: "var(--text)"  }}>
            Technical <span style={{ color: "var(--accent)" }}>Arsenal</span>
          </h2>
		  
          <p style={{ color: "var(--muted)", maxWidth: "460px", margin: "0 auto 3rem", lineHeight: 1.8, fontWeight: 300, fontSize: "1rem" }}>
            Combining production experience with ongoing  
			exploration of modern AI and software tools. 
          </p>		  

          <div
            className="skill-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
          >
            {Object.entries(SKILLS).map(([cat, techs]) => (
              <div key={cat} style={{
                background:  "var(--bg-card)",
                border:      "1px solid var(--border)",
                padding:     "1.75rem",
                transition:  "border-color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-a)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:      "0.68rem",
                  color:         "var(--accent)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom:  "1.1rem",
                }}>
                  {cat}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {techs.map((t) => <span key={t} className="stag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{ padding: "8rem 0", borderTop: "1px solid var(--border)", background: "var(--bg-2)" }}
      >
        <div className="section-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 3rem", textAlign: "center" }}>
          <div className="slabel" style={{ justifyContent: "center" }}>Contact</div>

          <h2 style={{
            fontSize:      "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight:    800,
            letterSpacing: "-0.03em",
            marginBottom:  "1.5rem",
            lineHeight:    0.95,
			color: "var(--text)",
          }}>
            Let's Build<br />
            <span style={{ color: "var(--accent)" }}>Something.</span>
          </h2>

          <p style={{ color: "var(--muted)", maxWidth: "440px", margin: "0 auto 3rem", lineHeight: 1.8, fontWeight: 300, fontSize: "1rem" }}>
            Exploring opportunities to build real-world AI systems 
			and contribute to the practical adoption of AI. 
          </p>

          {/* EDIT: your email, LinkedIn, GitHub */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            <a href="mailto:silasrp@gmail.com" className="btn-primary">Send Email</a>
            <a href="https://www.linkedin.com/in/silasrp/"  target="_blank" rel="noopener noreferrer" className="btn-ghost">LinkedIn ↗</a>
            <a href="https://github.com/silasrp/"    target="_blank" rel="noopener noreferrer" className="btn-ghost">GitHub ↗</a>
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
            silasrp@gmail.com {/* EDIT */}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 3rem" }}>
        <div style={{
          maxWidth:       "1200px",
          margin:         "0 auto",
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          flexWrap:       "wrap",
          gap:            "1rem",
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em" }}>
            © {new Date().getFullYear()} · All rights reserved
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em" }}>
            Built with React · Deployed on Vercel {/* EDIT if needed */}
          </span>
        </div>
      </footer>
    </div>
  );
}
