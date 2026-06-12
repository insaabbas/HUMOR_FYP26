import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import laughEmoji from '../assets/emojis/laugh.png';

const Home = () => {
  const localJokes = [
    { setup: "Why did the computer show up late to work?", punchline: "Because it had a hard drive!" },
    { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" }
  ];

  const [jokeCount] = useState(1080);
  const [dailyJoke, setDailyJoke] = useState({ setup: "Loading...", punchline: "..." });
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const location = useLocation();

  const fetchRandomJoke = async () => {
    setLoadingJoke(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: "Tell me a funny short joke or pun." }),
      });
      const data = await response.json();
      if (data.joke) {
        const parts = data.joke.split('?');
        if (parts.length > 1) {
          setDailyJoke({ setup: parts[0] + '?', punchline: parts[1] });
        } else {
          setDailyJoke({ setup: "Here's a thought:", punchline: data.joke });
        }
      } else { throw new Error("No joke"); }
    } catch (error) {
      const randomIndex = Math.floor(Math.random() * localJokes.length);
      setDailyJoke(localJokes[randomIndex]);
    } finally { setLoadingJoke(false); }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["hero", "joke-of-day", "about", "contact"];
      const currentSection = sections.find(id => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 300;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    fetchRandomJoke();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="lollify-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;600;700;900&display=swap');

        :root {
          --deep-purple: #2d002d;
          --bright-yellow: #ffdd00;
          --pink-glow: #db2777;
          --glass: rgba(255,255,255,0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; overflow-x: hidden; background: #fff; }
        html { scroll-behavior: smooth; }

        /* ── KEYFRAMES ─────────────────────────────────────── */
        @keyframes movingGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floating {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-18px) rotate(4deg); }
        }
        @keyframes arrowBounce {
          0%,100% { transform: translateX(-50%) translateY(0px); }
          50%      { transform: translateX(-50%) translateY(9px); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.75; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePop {
          0%  { opacity: 0; transform: scale(0.7); }
          80% { transform: scale(1.08); }
          100%{ opacity: 1; transform: scale(1); }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0)   scale(1);    }
          33%      { transform: translate(55px,-35px) scale(1.12); }
          66%      { transform: translate(-25px,25px) scale(0.9);  }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0)    scale(1);   }
          33%      { transform: translate(-45px,28px) scale(0.88); }
          66%      { transform: translate(38px,-45px) scale(1.18); }
        }
        @keyframes scrollLabelPulse {
          0%,100% { opacity: 0.4; letter-spacing: 3.5px; }
          50%      { opacity: 0.9; letter-spacing: 5px; }
        }
        @keyframes chevronCascade {
          0%,100% { opacity: 0.25; transform: rotate(45deg) translate(-2px,-2px); }
          50%      { opacity: 1;    transform: rotate(45deg) translate(1px,1px);   }
        }

        .animated-bg {
          background: linear-gradient(-45deg, #2d012d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        /* ── NAVBAR ───────────────────────────────────────── */
        .navbar {
          display: flex; align-items: center;
          padding: 0 5%; height: 90px;
          position: fixed; width: 100%; top: 0; z-index: 1000;
          transition: 0.4s; background: white;
          justify-content: space-between;
        }
        .navbar.scrolled { background: #fdfdff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .nav-logo { font-family: 'Lobster', cursive; font-size: 2.7rem; color: var(--deep-purple); text-decoration: none; min-width: 150px; }
        .nav-sections { display: flex; gap: 30px; flex: 1; justify-content: center; }
        .nav-pages { display: flex; gap: 25px; align-items: center; min-width: 300px; justify-content: flex-end; }
        .navbar a { text-decoration: none; color: var(--deep-purple); font-weight: 700; transition: 0.3s; position: relative; padding: 5px 0; }
        .navbar a:hover { color: var(--pink-glow); }
        .navbar a.active-link { color: var(--pink-glow) !important; }
        .navbar a.active-link::after { content:''; position:absolute; bottom:-2px; left:0; width:100%; height:3px; background:var(--pink-glow); border-radius:10px; }

        /* ── HERO ─────────────────────────────────────────── */
        /*
          KEY FIX: height:100vh + overflow:hidden ensures the section
          never grows taller than the viewport.
          The scroll arrow is position:absolute bottom:28px so it's
          ALWAYS anchored at the very bottom of the visible viewport.
        */
        .hero {
          height: 100vh;
          overflow: hidden;
          position: relative;
          color: white;
        }

        /* animated noise grain */
        .hero::before {
          content: '';
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
        }

        /* background depth orbs */
        .hero-orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
        .orb-1 { width:480px; height:480px; background:radial-gradient(circle, rgba(219,39,119,0.42) 0%, transparent 70%); top:-10%; left:-8%; animation: orb1 11s ease-in-out infinite; }
        .orb-2 { width:520px; height:520px; background:radial-gradient(circle, rgba(255,221,0,0.18) 0%, transparent 70%);  bottom:-15%; right:-10%; animation: orb2 14s ease-in-out infinite; }

        /* ── TWO-COLUMN INNER LAYOUT ─────────────────────── */
        /*
          Two columns inside the hero:
            LEFT  — eyebrow + headline + stats row
            RIGHT — joke card
          Both centred vertically. Emoji floats over the right side.
          Arrow sits at the very bottom, always in view.
        */
        .hero-inner {
          position: relative; z-index: 10;
          height: calc(100vh - 90px);   /* full height minus navbar */
          margin-top: 90px;             /* push below fixed navbar */
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
          padding: 0 6% 80px;          /* bottom-pad reserves space for arrow */
        }

        /* ── LEFT COLUMN ─────────────────────────────────── */
        .hero-left {
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 22px;
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          background: rgba(255,221,0,0.1);
          border: 1px solid rgba(255,221,0,0.38);
          color: var(--bright-yellow);
          font-size: 0.65rem; font-weight: 800;
          letter-spacing: 2.5px; text-transform: uppercase;
          padding: 7px 20px; border-radius: 50px;
          animation: badgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
        }
        .eyebrow-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--pink-glow);
          box-shadow: 0 0 10px var(--pink-glow);
          flex-shrink: 0;
        }

        .hero-h1 {
          font-size: clamp(2.6rem, 4.8vw, 4.4rem);
          font-weight: 900; line-height: 1.07; letter-spacing: -2px;
          text-align: left;
          animation: fadeUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }
        .hero-h1 .line1 { display: block; color: white; text-shadow: 0 4px 30px rgba(0,0,0,0.45); }
        .hero-h1 .line2 {
          display: block; color: var(--bright-yellow);
          filter: drop-shadow(0 3px 18px rgba(255,221,0,0.45));
          -webkit-text-stroke: 1.5px rgba(255,180,0,0.25);
          margin-top: 4px;
        }

        /* mini stat pills row */
        .hero-stats {
          display: flex; gap: 12px; flex-wrap: wrap;
          animation: fadeUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.55s both;
        }
        .hero-stat-pill {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 50px; padding: 7px 16px;
          font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.82);
          backdrop-filter: blur(8px);
        }
        .hero-stat-pill strong { color: var(--bright-yellow); font-size: 0.95rem; }

        /* ── RIGHT COLUMN — JOKE CARD ────────────────────── */
        .hero-right {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          animation: fadeUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.45s both;
        }

        /* floating emoji over card */
        .floating-emoji-card {
          position: absolute;
          top: -52px; right: -28px;
          width: 120px;
          animation: floating 4.5s ease-in-out infinite;
          filter: drop-shadow(0 12px 24px rgba(0,0,0,0.45));
          pointer-events: none; z-index: 20;
        }
        .floating-emoji-card-2 {
          position: absolute;
          bottom: -44px; left: -22px;
          width: 90px;
          animation: floating 5.5s ease-in-out infinite;
          animation-delay: 1.5s;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));
          pointer-events: none; z-index: 20;
        }

        .hero-joke-card {
          width: 100%;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 26px;
          padding: 32px 36px 28px;
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
          position: relative; overflow: hidden;
          box-shadow:
            0 32px 72px rgba(0,0,0,0.45),
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 1px 0 rgba(255,255,255,0.18) inset;
        }

        /* rainbow shimmer top stripe */
        .hero-joke-card::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:3px;
          background: linear-gradient(90deg, var(--pink-glow), var(--bright-yellow), #a855f7, var(--pink-glow));
          background-size: 300% auto;
          animation: shimmer 3.5s linear infinite;
        }
        /* bottom inner glow */
        .hero-joke-card::after {
          content: '';
          position: absolute; bottom:0; left:0; right:0; height:100px;
          background: linear-gradient(to top, rgba(219,39,119,0.07), transparent);
          pointer-events: none;
        }

        .joke-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--bright-yellow), #fbbf24);
          color: var(--deep-purple);
          font-size: 0.63rem; font-weight: 900;
          letter-spacing: 2.5px; text-transform: uppercase;
          padding: 6px 18px; border-radius: 50px;
          box-shadow: 0 4px 18px rgba(255,221,0,0.35);
          margin-bottom: 20px;
        }
        .joke-setup {
          font-size: 1.05rem; font-weight: 600;
          color: rgba(255,255,255,0.88); line-height: 1.68;
          margin-bottom: 18px;
        }
        .joke-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
        }
        .joke-divider::before, .joke-divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
        }
        .joke-divider-label {
          font-size: 0.58rem; font-weight: 800;
          letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,255,255,0.27); white-space: nowrap;
        }
        .joke-punchline {
          font-size: 1.22rem; font-weight: 800;
          color: var(--bright-yellow); line-height: 1.5;
          text-shadow: 0 2px 16px rgba(255,221,0,0.3);
          filter: drop-shadow(0 2px 10px rgba(255,221,0,0.22));
        }

        /* ── SCROLL ARROW — always pinned to viewport bottom ── */
        /*
          position:fixed + bottom keeps it glued to the viewport bottom
          while the user is in the hero section. A JS class can hide it
          after scrolling past if desired, but visually this always works.
          We use position:absolute on .hero so it's relative to the section,
          then set bottom so it sits right above the section edge.
        */
        .scroll-arrow-wrapper {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 9px;
          z-index: 30;
          text-decoration: none; cursor: pointer;
        }

        .scroll-label {
          font-size: 0.56rem; font-weight: 800;
          letter-spacing: 3.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          animation: scrollLabelPulse 2.6s ease-in-out infinite;
          transition: color 0.3s;
        }
        .scroll-arrow-wrapper:hover .scroll-label { color: var(--bright-yellow); }

        .scroll-btn {
          position: relative;
          width: 54px; height: 54px; border-radius: 50%;
          border: 1.5px solid rgba(255,221,0,0.48);
          background: rgba(255,221,0,0.07);
          display: flex; align-items: center; justify-content: center;
          /* arrowBounce keeps translateX(-50%) so the arrow stays centred */
          animation: arrowBounce 2.3s ease-in-out infinite;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .scroll-arrow-wrapper:hover .scroll-btn {
          background: rgba(255,221,0,0.18);
          border-color: var(--bright-yellow);
          box-shadow: 0 0 22px rgba(255,221,0,0.38);
        }

        /* dual pulse rings */
        .scroll-btn::before {
          content: ''; position: absolute; inset: -2px;
          border-radius: 50%; border: 1.5px solid rgba(255,221,0,0.48);
          animation: pulseRing 2.5s ease-out infinite;
        }
        .scroll-btn::after {
          content: ''; position: absolute; inset: -2px;
          border-radius: 50%; border: 1.5px solid rgba(255,221,0,0.3);
          animation: pulseRing 2.5s ease-out 1.25s infinite;
        }

        /* cascading chevrons */
        .chevron-stack { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 4px; }
        .chevron {
          width: 9px; height: 9px;
          border-right: 2.5px solid var(--bright-yellow);
          border-bottom: 2.5px solid var(--bright-yellow);
          transform: rotate(45deg);
          animation: chevronCascade 1.7s ease-in-out infinite;
        }
        .chevron.faded {
          animation-delay: 0.28s;
          border-color: rgba(255,221,0,0.38);
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 960px) {
          .nav-sections { display: none; }
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 0 5% 90px;
            align-content: center;
            gap: 28px;
            height: calc(100vh - 90px);
          }
          .hero-left { align-items: center; text-align: center; }
          .hero-h1 { text-align: center; font-size: clamp(2.2rem, 7vw, 3.4rem); }
          .hero-stats { justify-content: center; }
          .floating-emoji-card { width: 90px; top: -38px; right: -14px; }
          .floating-emoji-card-2 { display: none; }
          .hero-joke-card { padding: 24px 22px 22px; }
          .joke-setup { font-size: 0.95rem; }
          .joke-punchline { font-size: 1.05rem; }
        }
        @media (max-width: 540px) {
          .hero-h1 { font-size: clamp(2rem, 9vw, 2.8rem); letter-spacing: -1px; }
          .hero-inner { padding: 0 4% 90px; }
        }

        /* ─── REST — unchanged ────────────────────────────── */
        .section-padding { padding: 100px 5%; text-align: center; }
        .outer-container { background: #f0f0f0; border-radius: 60px; padding: 80px 40px; max-width: 1200px; margin: 0 auto; overflow: hidden; }
        .joke-card { max-width: 800px; margin: 40px auto; padding: 60px 40px; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); color: white; }
        .joke-text { font-size: 2rem; font-weight: 700; line-height: 1.2; }
        .punchline-text { color: var(--bright-yellow); margin-top: 20px; font-size: 1.5rem; font-weight: 500; }
        .refresh-btn { margin-top: 40px; padding: 12px 35px; border-radius: 50px; border: none; background: white; color: var(--deep-purple); cursor: pointer; font-weight: 900; transition: 0.3s; }
        .about-bg { color: white; }
        .stats { display: flex; justify-content: center; gap: 20px; margin-top: 50px; flex-wrap: wrap; }
        .stat-card { background: var(--glass); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; min-width: 200px; border-bottom: 5px solid var(--bright-yellow); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; text-align: left; }
        .form-box { padding: 40px; border-radius: 30px; color: white; }
        .submit-btn { width: 100%; padding: 15px; border-radius: 15px; border: none; background: white; color: var(--deep-purple); font-weight: 900; cursor: pointer; }
        .footer { color: white; padding: 80px 5% 40px; border-top: 6px solid var(--bright-yellow); }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 50px; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Lollify</Link>
        <div className="nav-sections">
          <a href="#hero"      className={activeSection === "hero"        ? "active-link" : ""}>Welcome</a>
          <a href="#joke-of-day" className={activeSection === "joke-of-day" ? "active-link" : ""}>Daily Joke</a>
          <a href="#about"     className={activeSection === "about"       ? "active-link" : ""}>About</a>
          <a href="#contact"   className={activeSection === "contact"     ? "active-link" : ""}>Contact</a>
        </div>
        <div className="nav-pages">
          <Link to="/"            className={location.pathname === "/"            ? "active-link" : ""}>Home</Link>
          <Link to="/text-humor"  className={location.pathname === "/text-humor"  ? "active-link" : ""}>Text Humor</Link>
          <Link to="/gif-caption" className={location.pathname === "/gif-caption" ? "active-link" : ""}>Gif Caption</Link>
          <Link to="/gif-prompt"  className={location.pathname === "/gif-prompt"  ? "active-link" : ""}>Gif Prompt</Link>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section id="hero" className="hero animated-bg">

        {/* depth orbs */}
        <div className="hero-orb orb-1"></div>
        <div className="hero-orb orb-2"></div>

        {/* ── two-column inner ── */}
        <div className="hero-inner">

          {/* LEFT — headline + stats */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              <span>AI-Powered Comedy Since 2026</span>
            </div>

            <h1 className="hero-h1">
              <span className="line1">Laughter is the</span>
              <span className="line2">Best Medicine</span>
            </h1>

            <div className="hero-stats">
              <div className="hero-stat-pill"><strong>1080+</strong> Jokes</div>
              <div className="hero-stat-pill"><strong>99%</strong> Better Moods</div>
              <div className="hero-stat-pill"> Daily Updated</div>
            </div>
          </div>

          {/* RIGHT — joke card */}
          <div className="hero-right">
            <img src={laughEmoji} alt="" className="floating-emoji-card" />

            <div className="hero-joke-card">
              <div className="joke-badge">
                <span>CS Joke of the Moment</span>
              </div>

              <p className="joke-setup">
                A SQL query walks into a bar, walks up to two tables and asks...
              </p>

              <div className="joke-divider">
                <span className="joke-divider-label">punchline incoming</span>
              </div>

              <p className="joke-punchline">
                &nbsp;&nbsp;"Can I JOIN you?"
              </p>
            </div>
          </div>
        </div>

        {/* ── SCROLL ARROW — position:absolute bottom, always visible ── */}
        <a href="#joke-of-day" className="scroll-arrow-wrapper">
         
          <div className="scroll-btn">
            <div className="chevron-stack">
              <div className="chevron faded"></div>
              <div className="chevron"></div>
            </div>
          </div>
        </a>

      </section>
      {/* ══════════════════════════════════════════════════════ */}

      {/* JOKE OF DAY */}
      <section id="joke-of-day" className="section-padding">
        <div className="outer-container">
          <h2 style={{fontSize:'3rem', color:'#2d002d'}}>Joke of the <span style={{color:'var(--pink-glow)'}}>Day</span></h2>
          <div className="joke-card animated-bg">
            <p className="joke-text">{dailyJoke.setup}</p>
            <p className="punchline-text">{dailyJoke.punchline}</p>
            <button className="refresh-btn" onClick={fetchRandomJoke}>
              {loadingJoke ? "Brewing humor..." : "Give me another!"}
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section-padding about-bg animated-bg">
        <h2 style={{fontSize:'3rem'}}>What is <span style={{color:'var(--bright-yellow)', display:'block', marginTop:'4px'}}>Lollify?</span></h2>
        <p style={{maxWidth:'700px', margin:'20px auto', opacity:'0.9'}}>We built a sanctuary for dad jokes and puns. No grumpiness allowed!</p>
        <div className="stats">
          <div className="stat-card"><h3>99%</h3><p>Better Moods</p></div>
          <div className="stat-card"><h3>{jokeCount}</h3><p>Jokes in Library</p></div>
          <div className="stat-card"><h3>1%</h3><p>Snorts</p></div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-padding">
        <div className="outer-container">
          <h2 style={{fontSize:'3rem', color:'#2d002d'}}>The Contact <span style={{fontStyle:'italic', color:'#db2777'}}>Mixer</span></h2>
          <div className="contact-grid">
            <div className="form-box animated-bg">
              <h3 style={{color:'var(--bright-yellow)'}}>Don't be a Stranger!</h3>
              <p style={{marginTop:'15px', color:'white'}}>Drop us a line or share a joke.</p>
              <div style={{marginTop:'40px', padding:'20px', background:'rgba(0,0,0,0.2)', borderRadius:'15px', color:'white'}}>
                 We reply faster than a dad can say "Hi Hungry, I'm Dad."
              </div>
            </div>
            <div className="form-box animated-bg">
              {!submitted ? (
                <form onSubmit={handleContactSubmit}>
                  <div style={{marginBottom:'20px'}}><input style={{width:'100%', padding:'15px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}} type="text" placeholder="Your Name" required /></div>
                  <div style={{marginBottom:'20px'}}><input style={{width:'100%', padding:'15px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}} type="email" placeholder="Email Address" required /></div>
                  <div style={{marginBottom:'20px'}}><textarea style={{width:'100%', padding:'15px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}} rows="4" placeholder="Your Message..." required></textarea></div>
                  <button type="submit" className="submit-btn">Send Message </button>
                </form>
              ) : (
                <div style={{textAlign:'center', padding:'40px 0'}}><h2>Boom! Sent. </h2><button onClick={() => setSubmitted(false)} className="submit-btn" style={{marginTop:'20px'}}>Send Another</button></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer animated-bg">
        <div className="footer-grid">
          <div>
            <h3 className="nav-logo" style={{color:'white'}}>Lollify</h3>
            <p style={{opacity:'0.8', marginTop:'15px'}}>Making the world brighter, one punchline at a time.</p>
          </div>
          <div>
            <h4 style={{color:'var(--bright-yellow)'}}>Explore</h4>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'15px'}}>
              <a href="#hero"    style={{color:'white', textDecoration:'none'}}>Welcome</a>
              <a href="#about"   style={{color:'white', textDecoration:'none'}}>About</a>
              <a href="#contact" style={{color:'white', textDecoration:'none'}}>Contact</a>
            </div>
          </div>
          <div>
            <h4 style={{color:'var(--bright-yellow)'}}>Newsletter</h4>
            <p style={{fontSize:'0.9rem', margin:'15px 0', color:'white'}}>Get the week's best jokes.</p>
            <div style={{display:'flex', gap:'5px'}}>
              <input type="email" placeholder="Email" style={{padding:'10px', borderRadius:'8px', border:'none', flex:1}} />
              <button style={{padding:'10px 20px', borderRadius:'8px', border:'none', background:'var(--bright-yellow)', fontWeight:'bold', color:'var(--deep-purple)'}}>Join</button>
            </div>
          </div>
        </div>
        <p style={{textAlign:'center', marginTop:'60px', opacity:0.6}}>© 2026 Lollify — Designed for Comedy & Code</p>
      </footer>
    </div>
  );
};

export default Home;