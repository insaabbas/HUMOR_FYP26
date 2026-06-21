import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import laughEmoji from '../assets/emojis/laugh.png';
import charOne from '../assets/A(1).png';
import charTwo from '../assets/A(2).png';
import charThree from '../assets/A(3).png';
import charFour from '../assets/A(4).png';

const Home = () => {
  const localJokes = [
    { setup: "Why did the computer show up late to work?", punchline: "Because it had a hard drive!" },
    { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" }
  ];

  const [jokeCount] = useState(1080);
  const [dailyJoke, setDailyJoke] = useState({ setup: "Loading...", punchline: "..." });
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // ── FUNNY-FICATION STATE ──────────────────────────────
  const [showSplash, setShowSplash] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);
  const [confettiBursts, setConfettiBursts] = useState([]);
  const [reaction, setReaction] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(""); // "", "sending", "sent", "error"

  const loadingPhrases = [
    "Brewing humor...",
    "Bribing the joke gods...",
    "Consulting the Dad Council...",
    "Untangling a pun...",
    "Polishing a punchline...",
    "Asking a chicken why it crossed the road...",
    "Googling 'how to be funny'...",
    "Microwaving a one-liner...",
    "Defragging the funny bone...",
    "Reticulating puns..."
  ];
  const [loadingPhrase, setLoadingPhrase] = useState(loadingPhrases[0]);

  const splashEmojis = ["😂", "🤣", "😆", "😝", "🤪", "😹"];
  const bgEmojis = ["😂", "🤣", "😆", "😜", "🤪", "😹", "😝", "🙃"];
  const sidePopEmojis = ["😂", "🤣", "😆", "😝", "🤪", "😹", "🙃", "😜", "🥳", "😎"];
  const tickerEmojis = ["😂", "🤣", "😆", "😝", "🤪", "😹", "🙃", "😜", "🥳", "🎉", "😎", "👻"];

  // confetti shown only during the splash screen
  const splashConfettiRef = useRef(
    Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      emoji: splashEmojis[Math.floor(Math.random() * splashEmojis.length)],
      delay: Math.random() * 1.1,
      duration: 1.6 + Math.random() * 1.3
    }))
  );

  const [sidePops, setSidePops] = useState([]);
  const lastPopScrollY = useRef(0);
  const sideTurn = useRef('left');

  const spawnSidePop = () => {
    const side = sideTurn.current;
    sideTurn.current = side === 'left' ? 'right' : 'left';
    const emoji = sidePopEmojis[Math.floor(Math.random() * sidePopEmojis.length)];
    const id = Date.now() + Math.random();
    const top = 12 + Math.random() * 68; // vh
    setSidePops(prev => [...prev.slice(-5), { id, side, emoji, top }]);
    setTimeout(() => {
      setSidePops(prev => prev.filter(p => p.id !== id));
    }, 1700);
  };

  // burst of pop-up emojis from a center point (used by refresh + reactions)
  const spawnCenterPopBurst = (count = 5) => {
    const pieces = Array.from({ length: count }).map((_, i) => {
      const id = Date.now() + Math.random() + i;
      const side = Math.random() > 0.5 ? 'left' : 'right';
      const emoji = sidePopEmojis[Math.floor(Math.random() * sidePopEmojis.length)];
      const top = 8 + Math.random() * 78;
      return { id, side, emoji, top };
    });
    setSidePops(prev => [...prev.slice(-6), ...pieces]);
    pieces.forEach(p => {
      setTimeout(() => {
        setSidePops(prev => prev.filter(x => x.id !== p.id));
      }, 1700);
    });
  };

  const location = useLocation();

  // confetti burst of emoji on button/emoji click — anchored to wherever was clicked
  const launchConfetti = (e, count = 14) => {
    const burstId = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const pieces = Array.from({ length: count }).map((_, i) => ({
      id: `${burstId}-${i}`,
      emoji: splashEmojis[Math.floor(Math.random() * splashEmojis.length)],
      x: originX,
      y: originY,
      dx: (Math.random() - 0.5) * 320,
      dy: -(Math.random() * 260 + 80),
      rot: (Math.random() - 0.5) * 540,
      delay: Math.random() * 0.12
    }));
    setConfettiBursts(prev => [...prev, ...pieces]);
    setTimeout(() => {
      const ids = new Set(pieces.map(p => p.id));
      setConfettiBursts(prev => prev.filter(p => !ids.has(p.id)));
    }, 1100);
  };

  // any clicked emoji (ticker, reaction row, etc.) bursts confetti from that spot
  const handleEmojiClick = (e) => {
    launchConfetti(e, 10);
  };

  const fetchRandomJoke = async () => {
    setLoadingJoke(true);
    setLoadingPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
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

      if (Math.abs(window.scrollY - lastPopScrollY.current) > 160) {
        lastPopScrollY.current = window.scrollY;
        spawnSidePop();
      }
    };
    window.addEventListener("scroll", handleScroll);
    fetchRandomJoke();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setSplashLeaving(true), 1600);
    const hideTimer = setTimeout(() => setShowSplash(false), 2150);
    return () => { clearTimeout(leaveTimer); clearTimeout(hideTimer); };
  }, []);

  const reactionCaptions = {
    lol: "Certified snort-worthy. Your neighbors heard that. 🏆",
    meh: "Tough crowd. We'll workshop it with our writers (a chicken and a Magic 8-Ball).",
    groan: "PERFECT. That's the dad joke spirit — pain IS the punchline."
  };

  const handleReaction = (e, emoji) => {
    setReaction(emoji);
    handleEmojiClick(e);
    spawnCenterPopBurst(emoji === 'lol' ? 7 : 4);
  };

  // ── shared Web3Forms access key, used by both the contact form and
  // the newsletter signup below — get yours free at https://web3forms.com
  // and paste it here once; both forms will start delivering real emails.
  const WEB3FORMS_ACCESS_KEY = "68f15c91-bae9-4b3d-ac15-7383664777ea";

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSending(true);
    setContactError(false);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New message from Lollify contact form",
          from_name: contactName || "Lollify visitor",
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } else {
        setContactError(true);
      }
    } catch (error) {
      setContactError(true);
    } finally {
      setContactSending(false);
    }
  };

  // ── newsletter signup: sends straight to insaabbas675@gmail.com via Web3Forms ──
  // Web3Forms is a free form-to-email relay — no backend server needed.
  // Uses the same WEB3FORMS_ACCESS_KEY defined above.

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New Lollify newsletter signup",
          from_name: "Lollify Newsletter",
          email: newsletterEmail,
          message: `New newsletter signup from Lollify: ${newsletterEmail}`,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setNewsletterStatus("sent");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
      }
    } catch (error) {
      setNewsletterStatus("error");
    } finally {
      setTimeout(() => setNewsletterStatus(""), 4000);
    }
  };

  return (
    <div className="lollify-app">
      {/* ══ SPLASH SCREEN ══ */}
      {showSplash && (
        <div className={`splash-screen ${splashLeaving ? 'leaving' : ''}`}>
          {splashConfettiRef.current.map(c => (
            <span
              key={c.id}
              className="splash-confetti"
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`
              }}
            >
              {c.emoji}
            </span>
          ))}
          <div className="splash-emoji-row">
            {splashEmojis.slice(0, 3).map((e, i) => <span key={i}>{e}</span>)}
          </div>
          <div className="splash-title">Lollify</div>
          <div className="splash-sub">deploying maximum laughs to production...</div>
          <div className="splash-dots"><span></span><span></span><span></span></div>
        </div>
      )}

      {/* ── ambient floating emojis behind everything ── */}
      <div className="bg-emoji-layer">
        {bgEmojis.map((e, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 13 + 4) % 96}%`,
              top: `${(i * 27 + 8) % 92}%`,
              fontSize: `${1.6 + (i % 3) * 0.8}rem`,
              animationDuration: `${8 + (i % 5) * 2}s`,
              animationDelay: `${i * 0.4}s`
            }}
          >
            {e}
          </span>
        ))}
      </div>

      {/* ── confetti pieces (click bursts) ── */}
      {confettiBursts.map(p => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.x, top: p.y,
            '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}s`
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* ── scroll/reaction/refresh-triggered emoji pop-ups from the sides ── */}
      {sidePops.map(p => (
        <span
          key={p.id}
          className={`side-pop-emoji ${p.side}`}
          style={{ top: `${p.top}vh` }}
        >
          {p.emoji}
        </span>
      ))}

      {/* ── bottom chase: cat chasing mouse along a wiggly, unpredictable path ── */}
      <div className="chase-track">
        <span className="chase-emoji runner">🐭</span>
        <span className="chase-emoji chaser">🐱</span>
        <span className="chase-poof">💨</span>
      </div>

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

        /* ── SPLASH SCREEN ────────────────────────────────── */
        @keyframes splashBgPan {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes splashBounceIn {
          0%   { opacity: 0; transform: scale(0.2) rotate(-25deg); }
          55%  { opacity: 1; transform: scale(1.18) rotate(8deg); }
          75%  { transform: scale(0.92) rotate(-4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes splashEmojiBounce {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-34px) scale(1.06); }
        }
        @keyframes splashTextWiggle {
          0%,100% { transform: rotate(-1.5deg); }
          50%      { transform: rotate(1.5deg); }
        }
        @keyframes splashDotJump {
          0%,80%,100% { transform: translateY(0); opacity: 0.5; }
          40%          { transform: translateY(-10px); opacity: 1; }
        }
        .splash-screen {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: linear-gradient(-45deg, #2d012d, #db2777, #ffdd00, #2d002d);
          background-size: 400% 400%;
          animation: splashBgPan 5s ease infinite;
          transition: opacity 0.55s ease, visibility 0.55s ease;
        }
        .splash-screen.leaving { opacity: 0; pointer-events: none; }
        .splash-emoji-row { display: flex; gap: 18px; margin-bottom: 22px; }
        .splash-emoji-row span {
          font-size: 4rem;
          display: inline-block;
          animation: splashBounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both,
                     splashEmojiBounce 1.1s ease-in-out 0.6s infinite;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,0.35));
        }
        .splash-emoji-row span:nth-child(1) { animation-delay: 0s, 0.6s; }
        .splash-emoji-row span:nth-child(2) { animation-delay: 0.1s, 0.7s; }
        .splash-emoji-row span:nth-child(3) { animation-delay: 0.2s, 0.8s; }
        .splash-title {
          font-family: 'Lobster', cursive;
          font-size: clamp(2.2rem, 6vw, 3.6rem);
          color: white; text-shadow: 0 4px 24px rgba(0,0,0,0.4);
          animation: splashTextWiggle 1.4s ease-in-out infinite;
        }
        .splash-sub {
          margin-top: 10px; color: rgba(255,255,255,0.85);
          font-weight: 700; letter-spacing: 1px; font-size: 0.95rem;
        }
        .splash-dots { display: flex; gap: 7px; margin-top: 22px; }
        .splash-dots span {
          width: 11px; height: 11px; border-radius: 50%;
          background: var(--bright-yellow);
          animation: splashDotJump 1.1s ease-in-out infinite;
        }
        .splash-dots span:nth-child(2) { animation-delay: 0.15s; }
        .splash-dots span:nth-child(3) { animation-delay: 0.3s; }

        /* confetti that falls only while the splash screen is showing */
        .splash-confetti {
          position: absolute; top: -30px; z-index: 2;
          font-size: 1.4rem; pointer-events: none;
          animation: confettiFall linear forwards;
        }

        /* ── AMBIENT FLOATING BACKGROUND EMOJIS ──────────────── */
        @keyframes bgEmojiDrift {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); }
          25%  { transform: translateY(-26px) translateX(14px) rotate(10deg); }
          50%  { transform: translateY(6px) translateX(-10px) rotate(-8deg); }
          75%  { transform: translateY(-16px) translateX(8px) rotate(6deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
        .bg-emoji-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 2;
          overflow: hidden;
        }
        .bg-emoji-layer span {
          position: absolute;
          opacity: 0.16;
          animation: bgEmojiDrift ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        /* ── CONFETTI BURST ───────────────────────────────────── */
        @keyframes confettiPop {
          0%   { transform: translate(0,0) rotate(0deg) scale(0.6); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1); opacity: 0; }
        }
        .confetti-piece {
          position: fixed; z-index: 5000; pointer-events: none;
          font-size: 1.6rem;
          animation: confettiPop 0.95s ease-out forwards;
        }

        /* ── WIGGLE BUTTONS ───────────────────────────────────── */
        @keyframes btnWiggle {
          0%,100% { transform: rotate(0deg) scale(1); }
          25%      { transform: rotate(-4deg) scale(1.05); }
          75%      { transform: rotate(4deg) scale(1.05); }
        }
        .refresh-btn:hover, .submit-btn:hover { animation: btnWiggle 0.4s ease-in-out; }

        /* ── REACTION ROW ─────────────────────────────────────── */
        @keyframes reactionPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); opacity: 1; }
        }
        .reaction-row { display: flex; justify-content: center; gap: 14px; margin-top: 26px; }
        .reaction-btn {
          font-size: 1.6rem; background: rgba(255,255,255,0.12);
          border: 2px solid transparent; border-radius: 50%;
          width: 56px; height: 56px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s, border-color 0.2s, background 0.2s;
        }
        .reaction-btn:hover { transform: scale(1.15) rotate(-6deg); background: rgba(255,255,255,0.22); }
        .reaction-btn.picked { border-color: var(--bright-yellow); animation: reactionPop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .reaction-caption {
          margin-top: 14px; font-weight: 700; color: white;
          min-height: 1.4em;
        }

        /* ── SCROLL / EVENT SIDE-POP EMOJIS ───────────────────── */
        @keyframes sidePopLeft {
          0%   { transform: translateX(-90px) rotate(-25deg) scale(0.4); opacity: 0; }
          35%  { transform: translateX(18px) rotate(10deg) scale(1.2); opacity: 1; }
          55%  { transform: translateX(-4px) rotate(-5deg) scale(1); opacity: 1; }
          80%  { transform: translateX(2px) rotate(2deg) scale(1); opacity: 1; }
          100% { transform: translateX(-30px) rotate(0deg) scale(0.85); opacity: 0; }
        }
        @keyframes sidePopRight {
          0%   { transform: translateX(90px) rotate(25deg) scale(0.4); opacity: 0; }
          35%  { transform: translateX(-18px) rotate(-10deg) scale(1.2); opacity: 1; }
          55%  { transform: translateX(4px) rotate(5deg) scale(1); opacity: 1; }
          80%  { transform: translateX(-2px) rotate(-2deg) scale(1); opacity: 1; }
          100% { transform: translateX(30px) rotate(0deg) scale(0.85); opacity: 0; }
        }
        .side-pop-emoji {
          position: fixed;
          font-size: 2.8rem;
          z-index: 4500;
          pointer-events: none;
          filter: drop-shadow(0 6px 14px rgba(0,0,0,0.35));
        }
        .side-pop-emoji.left  { left: 6px;  animation: sidePopLeft 1.7s ease-out forwards; }
        .side-pop-emoji.right { right: 6px; animation: sidePopRight 1.7s ease-out forwards; }
        @media (max-width: 640px) {
          .side-pop-emoji { font-size: 2.1rem; }
        }

        /* ── PEEKING CARTOON CHARACTERS (laughing crew) ───────── */
        /*
          Four character images, each pinned to a side of either the
          About or Contact section, "standing" at the edge of the
          viewport like they're peeking in from off-screen to join the
          joke. Each plays a continuous, slightly different laugh
          animation (bounce + wiggle/rotate) so the group doesn't read
          as four copies of one motion — staggered timing and slightly
          different rotation ranges make them feel independently alive.
        */
        @keyframes charLaughA {
          0%,100% { transform: translateY(0) rotate(-3deg) scale(1); }
          20%      { transform: translateY(-14px) rotate(4deg) scale(1.05); }
          45%      { transform: translateY(0) rotate(-6deg) scale(0.98); }
          70%      { transform: translateY(-9px) rotate(3deg) scale(1.03); }
        }
        @keyframes charLaughB {
          0%,100% { transform: translateY(0) rotate(4deg) scale(1); }
          25%      { transform: translateY(-11px) rotate(-5deg) scale(1.04); }
          50%      { transform: translateY(-2px) rotate(6deg) scale(0.97); }
          75%      { transform: translateY(-16px) rotate(-3deg) scale(1.06); }
        }
        .peeking-char {
          position: absolute;
          z-index: 6;
          pointer-events: none;
          filter: drop-shadow(0 14px 22px rgba(0,0,0,0.35));
        }
        .peeking-char img {
          display: block;
          width: 100%;
          height: auto;
        }
        .peeking-char.char-left  { left: 0; transform-origin: bottom left; }
        .peeking-char.char-right { right: 0; transform-origin: bottom right; }

        .char-about-left {
          bottom: 6%;
          width: 150px;
          animation: charLaughA 3.4s ease-in-out infinite;
        }
        .char-about-right {
          bottom: 4%;
          width: 165px;
          animation: charLaughB 3.8s ease-in-out infinite 0.4s;
        }
        .char-contact-left {
          bottom: -2%;
          width: 145px;
          animation: charLaughB 3.6s ease-in-out infinite 0.2s;
        }
        .char-contact-right {
          bottom: 0%;
          width: 160px;
          animation: charLaughA 4s ease-in-out infinite 0.6s;
        }

        @media (max-width: 900px) {
          .char-about-left, .char-contact-left   { width: 96px; }
          .char-about-right, .char-contact-right { width: 106px; }
        }
        @media (max-width: 600px) {
          .peeking-char { opacity: 0.85; }
          .char-about-left, .char-contact-left   { width: 76px; }
          .char-about-right, .char-contact-right { width: 84px; }
        }

        /* ── BOTTOM EMOJI TICKER ──────────────────────────────── */
        /* NOTE: this is now a normal in-flow element (NOT position:fixed),
           placed after the footer in the markup below, so it only ever
           appears once the user has scrolled all the way past the footer —
           never floating over the rest of the page. */
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .bottom-emoji-ticker {
          position: relative;
          width: 100%;
          height: 54px;
          background: linear-gradient(90deg, #2d002d, #3d003d 50%, #2d002d);
          border-top: 2px solid var(--bright-yellow);
          box-shadow: 0 -6px 20px rgba(0,0,0,0.35);
          overflow: hidden;
          display: flex; align-items: center;
        }
        .ticker-track {
          display: flex; align-items: center;
          gap: 38px; white-space: nowrap;
          width: max-content;
          animation: tickerScroll 16s linear infinite;
          padding-left: 38px;
        }
        .ticker-track span {
          font-size: 1.7rem; line-height: 1;
          cursor: pointer;
          display: inline-block;
          transition: transform 0.15s;
        }
        .ticker-track span:hover { transform: scale(1.25); }

        /* ── TOM & JERRY STYLE BOTTOM CHASE — zigzag, varied speed, real-feeling pursuit ── */
        /*
          Runner (mouse) and chaser (cat) each follow a hand-built,
          NON-repeating-pattern path: horizontal movement isn't monotonic
          (there are hesitations and tiny backtracks), vertical amplitude
          varies stop to stop instead of alternating high/low on a fixed
          beat, and percentage spacing between stops is uneven so speed
          visibly changes (quick dart, pause, quick dart again). The
          chaser's stops are NOT a fixed offset copy of the runner's —
          each was authored separately so the gap between them widens
          and narrows unpredictably, like a real chase rather than two
          shapes orbiting in sync.
        */
        @keyframes chaseRunnerPath {
          0%    { left: -12%; bottom: 4px;  transform: scaleX(1) rotate(0deg); }
          5%    { left: -2%;  bottom: 26px; transform: scaleX(1) rotate(-10deg); }
          11%   { left: 9%;   bottom: 6px;  transform: scaleX(1) rotate(6deg); }
          14%   { left: 7%;   bottom: 14px; transform: scaleX(1) rotate(-2deg); }
          21%   { left: 21%;  bottom: 38px; transform: scaleX(1) rotate(-12deg); }
          26%   { left: 29%;  bottom: 2px;  transform: scaleX(1) rotate(8deg); }
          30%   { left: 26%;  bottom: 10px; transform: scaleX(1) rotate(0deg); }
          38%   { left: 44%;  bottom: 30px; transform: scaleX(1) rotate(-9deg); }
          43%   { left: 52%;  bottom: 6px;  transform: scaleX(1) rotate(5deg); }
          49%   { left: 50%;  bottom: 18px; transform: scaleX(1) rotate(-3deg); }
          57%   { left: 67%;  bottom: 42px; transform: scaleX(1) rotate(-11deg); }
          62%   { left: 76%;  bottom: 4px;  transform: scaleX(1) rotate(9deg); }
          68%   { left: 88%;  bottom: 24px; transform: scaleX(1) rotate(-6deg); }
          74%   { left: 100%; bottom: 8px;  transform: scaleX(1) rotate(0deg); }
          79%   { left: 110%; bottom: 2px;  transform: scaleX(1) rotate(0deg); opacity: 1; }
          80%   { opacity: 0; }
          80.01%{ left: -12%; bottom: 4px;  transform: scaleX(-1) rotate(0deg); opacity: 0; }
          83%   { opacity: 1; }
          88%   { left: 4%;   bottom: 32px; transform: scaleX(-1) rotate(8deg); }
          93%   { left: 1%;   bottom: 12px; transform: scaleX(-1) rotate(-4deg); }
          100%  { left: -12%; bottom: 4px;  transform: scaleX(-1) rotate(0deg); }
        }
        @keyframes chaseChaserPath {
          0%    { left: -24%; bottom: 2px;  transform: scaleX(1) rotate(0deg); }
          4%    { left: -18%; bottom: 8px;  transform: scaleX(1) rotate(3deg); }
          9%    { left: -3%;  bottom: 30px; transform: scaleX(1) rotate(-8deg); }
          15%   { left: 6%;   bottom: 4px;  transform: scaleX(1) rotate(7deg); }
          19%   { left: 4%;   bottom: 16px; transform: scaleX(1) rotate(-2deg); }
          25%   { left: 16%;  bottom: 6px;  transform: scaleX(1) rotate(5deg); }
          32%   { left: 32%;  bottom: 34px; transform: scaleX(1) rotate(-10deg); }
          37%   { left: 38%;  bottom: 2px;  transform: scaleX(1) rotate(9deg); }
          44%   { left: 36%;  bottom: 20px; transform: scaleX(1) rotate(-4deg); }
          50%   { left: 49%;  bottom: 6px;  transform: scaleX(1) rotate(0deg); }
          56%   { left: 61%;  bottom: 36px; transform: scaleX(1) rotate(-9deg); }
          61%   { left: 70%;  bottom: 8px;  transform: scaleX(1) rotate(10deg); }
          67%   { left: 81%;  bottom: 28px; transform: scaleX(1) rotate(-5deg); }
          73%   { left: 93%;  bottom: 4px;  transform: scaleX(1) rotate(0deg); }
          79%   { left: 110%; bottom: 2px;  transform: scaleX(1) rotate(0deg); opacity: 1; }
          80%   { opacity: 0; }
          80.01%{ left: -24%; bottom: 2px;  transform: scaleX(-1) rotate(0deg); opacity: 0; }
          82%   { opacity: 1; }
          86%   { left: -6%;  bottom: 22px; transform: scaleX(-1) rotate(6deg); }
          91%   { left: -10%; bottom: 4px;  transform: scaleX(-1) rotate(-3deg); }
          100%  { left: -24%; bottom: 2px;  transform: scaleX(-1) rotate(0deg); }
        }
        @keyframes chaseHop {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-9px); }
        }
        @keyframes poofFlicker {
          0%, 4%   { opacity: 0; }
          6%       { opacity: 0.8; }
          12%, 16% { opacity: 0; }
          18%      { opacity: 0.7; }
          24%, 30% { opacity: 0; }
          32%      { opacity: 0.75; }
          38%, 44% { opacity: 0; }
          46%      { opacity: 0.7; }
          52%, 58% { opacity: 0; }
          60%      { opacity: 0.8; }
          66%, 78% { opacity: 0; }
          80%      { opacity: 0.65; }
          83%, 100% { opacity: 0; }
        }
        .chase-track {
          position: fixed; left: 0; right: 0; bottom: 0;
          height: 64px; z-index: 3050;
          overflow: hidden; pointer-events: none;
        }
        .chase-emoji {
          position: absolute;
          font-size: 2.2rem; line-height: 1;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
          will-change: left, bottom, transform;
        }
        /* each runs its own zigzag path PLUS a faster independent hop layered on top for scurry texture */
        .chase-emoji.runner {
          animation: chaseRunnerPath 9.5s cubic-bezier(0.6,0.04,0.4,0.96) infinite,
                     chaseHop 0.3s ease-in-out infinite;
        }
        .chase-emoji.chaser {
          animation: chaseChaserPath 9.5s cubic-bezier(0.6,0.04,0.4,0.96) infinite,
                     chaseHop 0.26s ease-in-out infinite;
        }
        .chase-poof {
          position: absolute; bottom: 4px;
          font-size: 1.5rem;
          animation: chaseChaserPath 9.5s cubic-bezier(0.6,0.04,0.4,0.96) infinite,
                     poofFlicker 9.5s linear infinite;
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

        .hero-inner {
          position: relative; z-index: 10;
          height: calc(100vh - 90px);
          margin-top: 90px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
          padding: 0 6% 80px;
        }

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

        .hero-right {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          animation: fadeUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.45s both;
        }

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

        .hero-joke-card::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:3px;
          background: linear-gradient(90deg, var(--pink-glow), var(--bright-yellow), #a855f7, var(--pink-glow));
          background-size: 300% auto;
          animation: shimmer 3.5s linear infinite;
        }
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
          animation: arrowBounce 2.3s ease-in-out infinite;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .scroll-arrow-wrapper:hover .scroll-btn {
          background: rgba(255,221,0,0.18);
          border-color: var(--bright-yellow);
          box-shadow: 0 0 22px rgba(255,221,0,0.38);
        }

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
        .section-padding { padding: 100px 5%; text-align: center; position: relative; }
        .outer-container { background: #f0f0f0; border-radius: 60px; padding: 80px 40px; max-width: 1200px; margin: 0 auto; overflow: hidden; }
        .joke-card { max-width: 800px; margin: 40px auto; padding: 60px 40px; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); color: white; }
        .joke-text { font-size: 2rem; font-weight: 700; line-height: 1.2; }
        .punchline-text { color: var(--bright-yellow); margin-top: 20px; font-size: 1.5rem; font-weight: 500; }
        .refresh-btn { margin-top: 40px; padding: 12px 35px; border-radius: 50px; border: none; background: white; color: var(--deep-purple); cursor: pointer; font-weight: 900; transition: 0.3s; }
        .about-bg { color: white; overflow: hidden; }
        .stats { display: flex; justify-content: center; gap: 20px; margin-top: 50px; flex-wrap: wrap; }
        .stat-card { background: var(--glass); backdrop-filter: blur(10px); padding: 30px; border-radius: 20px; min-width: 200px; border-bottom: 5px solid var(--bright-yellow); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; text-align: left; }
        .form-box { padding: 40px; border-radius: 30px; color: white; }
        .submit-btn { width: 100%; padding: 15px; border-radius: 15px; border: none; background: white; color: var(--deep-purple); font-weight: 900; cursor: pointer; }
        .footer { color: white; padding: 80px 5% 60px; border-top: 6px solid var(--bright-yellow); }
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

        <div className="hero-orb orb-1"></div>
        <div className="hero-orb orb-2"></div>

        <div className="hero-inner">

          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              <span>Powered by AI and Mild Regret</span>
            </div>

            <h1 className="hero-h1">
              <span className="line1">Laughter is the</span>
              <span className="line2">Best Medicine*</span>
            </h1>

            <div className="hero-stats">
              <div className="hero-stat-pill"><strong>1080+</strong> Jokes</div>
              <div className="hero-stat-pill"><strong>99%</strong> Better Moods</div>
              <div className="hero-stat-pill"><strong>0</strong> Refunds (it's free)</div>
            </div>
          </div>

          <div className="hero-right">
            <img src={laughEmoji} alt="" className="floating-emoji-card" />
            <span className="floating-emoji-card-2" style={{fontSize: '3.4rem', lineHeight: 1}}>🤣</span>

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

        <a href="#joke-of-day" className="scroll-arrow-wrapper">
          <span className="scroll-label">keep scrolling, it gets dumber</span>
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
          <h2 style={{fontSize:'3rem', color:'#2d002d'}}>Joke of the <span style={{color:'var(--pink-glow)'}}>Day</span> (We Made It Up)</h2>
          <div className="joke-card animated-bg">
            <p className="joke-text">{dailyJoke.setup}</p>
            <p className="punchline-text">{dailyJoke.punchline}</p>
            <button
              className="refresh-btn"
              onClick={(e) => { launchConfetti(e); spawnCenterPopBurst(3); fetchRandomJoke(); }}
            >
              {loadingJoke ? loadingPhrase : "Hit me again! 🎉"}
            </button>

            <div className="reaction-row">
              <button
                className={`reaction-btn ${reaction === 'lol' ? 'picked' : ''}`}
                onClick={(e) => handleReaction(e, 'lol')}
                aria-label="Hilarious"
              >😂</button>
              <button
                className={`reaction-btn ${reaction === 'meh' ? 'picked' : ''}`}
                onClick={(e) => handleReaction(e, 'meh')}
                aria-label="Meh"
              >😐</button>
              <button
                className={`reaction-btn ${reaction === 'groan' ? 'picked' : ''}`}
                onClick={(e) => handleReaction(e, 'groan')}
                aria-label="Groan"
              >🙄</button>
            </div>
            <p className="reaction-caption">
              {reaction && reactionCaptions[reaction]}
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section-padding about-bg animated-bg">
        {/* peeking laughing characters #1 and #2 */}
        <div className="peeking-char char-left char-about-left">
          <img src={charOne} alt="Laughing cartoon character" />
        </div>
        <div className="peeking-char char-right char-about-right">
          <img src={charTwo} alt="Laughing cartoon character" />
        </div>

        <h2 style={{fontSize:'3rem'}}>What is <span style={{color:'var(--bright-yellow)', display:'block', marginTop:'4px'}}>Lollify?</span></h2>
        <p style={{maxWidth:'700px', margin:'20px auto', opacity:'0.9'}}>A witness-protection program for dad jokes. We took them in, gave them a home, and now they refuse to leave. No grumpiness allowed past this point.</p>
        <div className="stats">
          <div className="stat-card"><h3>99%</h3><p>Better Moods</p></div>
          <div className="stat-card"><h3>{jokeCount}</h3><p>Jokes in Library (and counting)</p></div>
          <div className="stat-card"><h3>1%</h3><p>Unexplained Snorts</p></div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-padding">
        {/* peeking laughing characters #3 and #4 */}
        <div className="peeking-char char-left char-contact-left">
          <img src={charThree} alt="Laughing cartoon character" />
        </div>
        <div className="peeking-char char-right char-contact-right">
          <img src={charFour} alt="Laughing cartoon character" />
        </div>

        <div className="outer-container">
          <h2 style={{fontSize:'3rem', color:'#2d002d'}}>The Contact <span style={{fontStyle:'italic', color:'#db2777'}}>Mixer</span></h2>
          <div className="contact-grid">
            <div className="form-box animated-bg">
              <h3 style={{color:'var(--bright-yellow)'}}>Don't be a Stranger!</h3>
              <p style={{marginTop:'15px', color:'white'}}>Drop us a line, share a joke, or just yell into the void. We're listening (mostly).</p>
              <div style={{marginTop:'40px', padding:'20px', background:'rgba(0,0,0,0.2)', borderRadius:'15px', color:'white'}}>
                 We reply faster than a dad can say "Hi Hungry, I'm Dad."
              </div>
            </div>
            <div className="form-box animated-bg">
              {!submitted ? (
                <form onSubmit={handleContactSubmit}>
                  <div style={{marginBottom:'20px'}}>
                    <input
                      style={{width:'100%', padding:'15px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}}
                      type="text"
                      placeholder="Your Name (or alias)"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <input
                      style={{width:'100%', padding:'15px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}}
                      type="email"
                      placeholder="Email Address"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <textarea
                      style={{width:'100%', padding:'15px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}}
                      rows="4"
                      placeholder="Your Message (puns encouraged, groans tolerated)..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-btn" disabled={contactSending} style={{opacity: contactSending ? 0.7 : 1}}>
                    {contactSending ? "Sending..." : "Launch Message 🚀"}
                  </button>
                  {contactError && (
                    <p style={{color: '#ffb4b4', marginTop: '12px', fontSize: '0.85rem'}}>Something went wrong — mind trying again?</p>
                  )}
                </form>
              ) : (
                <div style={{textAlign:'center', padding:'40px 0'}}><h2>Boom! Sent. 💥</h2><p style={{opacity:0.8, marginTop:'10px'}}>It's somewhere in the internet now. Godspeed.</p><button onClick={() => setSubmitted(false)} className="submit-btn" style={{marginTop:'20px'}}>Send Another</button></div>
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
            <p style={{opacity:'0.8', marginTop:'15px'}}>Making the world brighter, one punchline (and one groan) at a time.</p>
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
            <p style={{fontSize:'0.9rem', margin:'15px 0', color:'white'}}>Get the week's best jokes, zero spam, mild dad energy.</p>
            <form onSubmit={handleNewsletterSubmit} style={{display:'flex', gap:'5px'}}>
              <input
                type="email"
                placeholder="Email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{padding:'10px', borderRadius:'8px', border:'none', flex:1}}
              />
              <button
                type="submit"
                disabled={newsletterStatus === "sending"}
                style={{padding:'10px 20px', borderRadius:'8px', border:'none', background:'var(--bright-yellow)', fontWeight:'bold', color:'var(--deep-purple)', cursor: 'pointer', opacity: newsletterStatus === "sending" ? 0.7 : 1}}
              >
                {newsletterStatus === "sending" ? "..." : "Join"}
              </button>
            </form>
            {newsletterStatus === "sent" && (
              <p style={{fontSize:'0.8rem', marginTop:'8px', color: 'var(--bright-yellow)'}}>You're in! Check your inbox.</p>
            )}
            {newsletterStatus === "error" && (
              <p style={{fontSize:'0.8rem', marginTop:'8px', color: '#ff8a8a'}}>Something went wrong — try again?</p>
            )}
          </div>
        </div>
        <p style={{textAlign:'center', marginTop:'60px', opacity:0.6}}>© 2026 Lollify — Designed for Comedy & Code (and one very tired mouse)</p>
      </footer>

      {/* ── bottom ticker: emojis running one after another ── */}
      {/* Lives in normal page flow, right after the footer, so it only
          shows up once you've scrolled all the way past everything else. */}
      <div className="bottom-emoji-ticker">
        <div className="ticker-track">
          {[...Array(2)].flatMap((_, k) =>
            tickerEmojis.map((e, i) => (
              <span key={`${k}-${i}`} onClick={handleEmojiClick}>{e}</span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;