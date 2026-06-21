import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import heroVideo from '../assets/download (1).mp4';
import emojiHeroVideo from '../assets/EMOJI_HERO_TEXT_BASED.mp4';
import catVideo from '../assets/cat.mp4';
import girlVideo from '../assets/girl.mp4';
import rabbitVideo from '../assets/rabbit.mp4';
import bunnyVideo from '../assets/bunny.mp4';
import robotVideo from '../assets/robot.mp4';
import cattoVideo from '../assets/catto.mp4';
import StorySlider from '../components/StorySlider';

// ── reusable scattered/floating emoji background, used to liven up
// the Lab, Stories, and Footer sections so they don't feel flat next
// to the animated hero ──────────────────────────────────────────────
const FloatingEmojis = ({ emojis, count = 14, opacity = 0.16, sizeMin = 22, sizeMax = 46 }) => {
  const pieces = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      duration: 6 + Math.random() * 6,
      delay: Math.random() * -6,
      fx: (Math.random() - 0.5) * 50,
      fy: (Math.random() - 0.5) * 40,
      frot: (Math.random() - 0.5) * 30,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="floating-emoji-bg" aria-hidden="true">
      {pieces.map(p => (
        <span
          key={p.id}
          className="floating-emoji-piece"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--fx': `${p.fx}px`,
            '--fy': `${p.fy}px`,
            '--frot': `${p.frot}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

// ── wavy SVG divider dropped between sections for a playful seam
// instead of a hard, flat color cut ─────────────────────────────────
const SectionWave = ({ fromColor, toColor, toGradient = false, flip = false }) => (
  <div className="section-wave" style={{ background: fromColor }}>
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={flip ? { transform: 'scaleY(-1)' } : undefined}>
      <defs>
        <linearGradient id="waveAnimatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d012d" />
          <stop offset="40%" stopColor="#3d003d" />
          <stop offset="70%" stopColor="#184b63" />
          <stop offset="100%" stopColor="#2d002d" />
        </linearGradient>
      </defs>
      <path
        d="M0,30 C150,60 350,0 600,20 C850,40 1050,5 1200,25 L1200,60 L0,60 Z"
        fill={toGradient ? 'url(#waveAnimatedGradient)' : toColor}
      />
    </svg>
  </div>
);

const TextHumor = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [activeMode, setActiveMode] = useState("words"); 
  
  const [headline, setHeadline] = useState("");
  const [headlineJoke, setHeadlineJoke] = useState("");
  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false);
  const [headlineLoadingPhrase, setHeadlineLoadingPhrase] = useState("");

  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [wordJoke, setWordJoke] = useState("");
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [wordLoadingPhrase, setWordLoadingPhrase] = useState("");

  const [shareToast, setShareToast] = useState("");
  const [labConfetti, setLabConfetti] = useState([]);
  const [pageBurst, setPageBurst] = useState([]);
  const [pageBurstWiping, setPageBurstWiping] = useState(false);
  const [ropePull, setRopePull] = useState(0); // how far the rope is currently pulled down (px)
  const [ropeDragging, setRopeDragging] = useState(false);
  const [ropeTriggered, setRopeTriggered] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(""); // "", "sending", "sent", "error"

  const location = useLocation();
  const ropeStartYRef = useRef(0);
  const heroVideoRef = useRef(null);
  const emojiHeroVideoRef = useRef(null);

  // ── funny loading phrases for each generator ──────────
  const wordLoadingPhrases = [
    "Smashing words together...",
    "Checking if these words are friends...",
    "Consulting the thesaurus mafia...",
    "Forcing an unlikely friendship...",
    "Running word-on-word combat...",
    "Asking a dictionary to lighten up..."
  ];
  const headlineLoadingPhrases = [
    "Reading between the lines...",
    "Finding the joke the editor missed...",
    "Bribing a tabloid intern...",
    "Fact-checking for laughs, not facts...",
    "Spinning the news cycle (literally)...",
    "Asking a satirist for a second opinion..."
  ];

  // playful fallback lines if the joke API whiffs
  const wordFailLines = [
    "The alchemy failed! Even chemistry has limits.",
    "Those two words refused to be friends. Try a different pair.",
    "Combined them and got... nothing. Science is hard."
  ];
  const headlineFailLines = [
    "The AI read the headline and just sighed.",
    "Even satire has standards. This one stumped us.",
    "The punchline machine jammed. Send help (or a new headline)."
  ];

  const spawnLabConfetti = () => {
    const emojis = ["🧪", "✨", "😂", "🎉", "🤣"];
    const pieces = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      dx: (Math.random() - 0.5) * 280,
      dy: -(Math.random() * 220 + 60),
      rot: (Math.random() - 0.5) * 480,
      delay: Math.random() * 0.1
    }));
    setLabConfetti(prev => [...prev, ...pieces]);
    setTimeout(() => {
      const ids = new Set(pieces.map(p => p.id));
      setLabConfetti(prev => prev.filter(p => !ids.has(p.id)));
    }, 1000);
  };

  // ── full-screen emoji burst on page load: explode outward, fall &
  // bounce on the floor, pile up, then wipe away together ──────────
  const spawnPageBurst = () => {
    const emojis = ["😂", "🤣", "😆", "🎉", "✨", "🥳", "😎", "🔥", "💥", "😹", "🙌", "⭐"];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const count = 28;

    const pieces = Array.from({ length: count }).map((_, i) => {
      // origin near center-top, spreads outward across the whole screen
      const originX = vw / 2 + (Math.random() - 0.5) * 120;
      const originY = vh * 0.25;
      // final resting spot spread across full width, near the bottom
      const landX = Math.random() * vw;
      const landY = vh - (40 + Math.random() * 40); // rest near floor
      const size = 38 + Math.random() * 46; // big sizes, varied
      const burstDx = landX - originX;
      const burstDy = landY - originY;
      const rot = (Math.random() - 0.5) * 720;
      const bounceHeight = 30 + Math.random() * 40;
      const delay = Math.random() * 0.5;

      return {
        id: Date.now() + Math.random() + i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        originX,
        originY,
        burstDx,
        burstDy,
        rot,
        size,
        bounceHeight,
        delay
      };
    });

    setPageBurst(pieces);
    setPageBurstWiping(false);

    // start the wipe-away once everything has landed & bounced
    setTimeout(() => setPageBurstWiping(true), 2600);
    // fully remove from DOM after the wipe animation finishes
    setTimeout(() => setPageBurst([]), 3400);
  };

  // ── piñata-style pull rope: drag the handle down far enough to trigger ──
  const ROPE_TRIGGER_DISTANCE = 130; // px the rope must be pulled to fire
  const ROPE_MAX_DISTANCE = 160; // visual cap so it doesn't stretch forever

  const handleRopeDragStart = (clientY) => {
    if (ropeTriggered) return;
    setRopeDragging(true);
    ropeStartYRef.current = clientY;
  };

  const handleRopeDragMove = (clientY) => {
    if (!ropeDragging || ropeTriggered) return;
    const delta = Math.max(0, clientY - ropeStartYRef.current);
    setRopePull(Math.min(delta, ROPE_MAX_DISTANCE));
    if (delta >= ROPE_TRIGGER_DISTANCE) {
      setRopeTriggered(true);
      setRopeDragging(false);
      spawnPageBurst();
      // spring the rope back up after the yank
      setTimeout(() => {
        setRopePull(0);
        setTimeout(() => setRopeTriggered(false), 600);
      }, 250);
    }
  };

  const handleRopeDragEnd = () => {
    if (!ropeTriggered) {
      setRopePull(0);
    }
    setRopeDragging(false);
  };



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["lab", "trending"];
      const currentSection = sections.find(id => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 400;
        }
        return false;
      });
      setActiveSection(currentSection || "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // slow the hero background video down so it doesn't feel sped-up
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.playbackRate = 0.6;
    }
    if (emojiHeroVideoRef.current) {
      emojiHeroVideoRef.current.playbackRate = 0.6;
    }
  }, []);

  // track the drag across the whole window so the rope follows the
  // cursor/finger even if it slips off the handle itself
  useEffect(() => {
    if (!ropeDragging) return;

    const onMouseMove = (e) => handleRopeDragMove(e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleRopeDragMove(e.touches[0].clientY);
    };
    const onUp = () => handleRopeDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [ropeDragging, ropeTriggered]);

  



  const generateHeadlineJoke = async (e) => {
    e.preventDefault();
    setIsGeneratingHeadline(true);
    setHeadlineJoke("");
    setHeadlineLoadingPhrase(headlineLoadingPhrases[Math.floor(Math.random() * headlineLoadingPhrases.length)]);
    try {
      const response = await fetch('http://localhost:5000/api/generate-joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Write a funny punchline for this headline: "${headline}"` }),
      });
      const data = await response.json();
      setHeadlineJoke(data.joke || headlineFailLines[Math.floor(Math.random() * headlineFailLines.length)]);
      spawnLabConfetti();
    } catch (error) {
      setHeadlineJoke("Connection error. Even our server needed a moment to process that headline.");
    } finally { setIsGeneratingHeadline(false); }
  };

  const generateWordJoke = async (e) => {
    e.preventDefault();
    setIsGeneratingWord(true);
    setWordJoke("");
    setWordLoadingPhrase(wordLoadingPhrases[Math.floor(Math.random() * wordLoadingPhrases.length)]);
    try {
      const response = await fetch('http://localhost:5000/api/generate-joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Create a joke using the words "${word1}" and "${word2}".` }),
      });
      const data = await response.json();
      setWordJoke(data.joke || wordFailLines[Math.floor(Math.random() * wordFailLines.length)]);
      spawnLabConfetti();
    } catch (error) {
      setWordJoke("Connection error. The words got lost in transit.");
    } finally { setIsGeneratingWord(false); }
  };

  

  const handleShare = (story) => {
    navigator.clipboard?.writeText(`"${story.content}" — ${story.title} | Lollify`);
    setShareToast(`"${story.title}" copied! Go forth and ruin a group chat.`);
    setTimeout(() => setShareToast(""), 2500);
  };

  // ── newsletter signup: sends straight to insaabbas675@gmail.com via Web3Forms ──
  // Web3Forms is a free form-to-email relay — no backend server needed.
  // Replace WEB3FORMS_ACCESS_KEY below with your own key from https://web3forms.com
  const WEB3FORMS_ACCESS_KEY = "68f15c91-bae9-4b3d-ac15-7383664777ea";

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;700;900&display=swap');
        
        :root {
          --deep-purple: #2d002d;
          --bright-yellow: #ffdd00;
          --pink-glow: #db2777;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background: #fff; overflow-x: hidden; }
        html { scroll-behavior: smooth; }

        @keyframes movingGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes toastIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── lab confetti burst on successful generation ── */
        @keyframes labConfettiPop {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(0.6); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)) scale(1); opacity: 0; }
        }
        .lab-confetti-piece {
          position: absolute; left: 50%; top: 10px; z-index: 50; pointer-events: none;
          font-size: 1.5rem;
          animation: labConfettiPop 0.9s ease-out forwards;
        }

        /* ── full-screen page-load emoji burst ──────────────────── */
        .page-burst-layer {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 99999;
          pointer-events: none;
          overflow: hidden;
        }

        @keyframes burstFlyAndBounce {
          0%   { transform: translate(0, 0) rotate(0deg) scale(0.3); opacity: 0; }
          8%   { opacity: 1; }
          55%  { transform: translate(var(--bdx), var(--bdy)) rotate(var(--brot)) scale(1); opacity: 1; }
          70%  { transform: translate(var(--bdx), calc(var(--bdy) - var(--bounce))) rotate(var(--brot)) scale(1); }
          82%  { transform: translate(var(--bdx), var(--bdy)) rotate(var(--brot)) scale(1); }
          90%  { transform: translate(var(--bdx), calc(var(--bdy) - calc(var(--bounce) * 0.4))) rotate(var(--brot)) scale(1); }
          100% { transform: translate(var(--bdx), var(--bdy)) rotate(var(--brot)) scale(1); opacity: 1; }
        }

        .page-burst-piece {
          position: absolute;
          left: 0;
          top: 0;
          line-height: 1;
          will-change: transform, opacity;
          animation: burstFlyAndBounce 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          filter: drop-shadow(0 8px 14px rgba(0,0,0,0.25));
        }

        @keyframes pageBurstWipe {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(40px); }
        }

        .page-burst-layer.wiping .page-burst-piece {
          animation: pageBurstWipe 0.7s ease-in forwards;
        }

        /* ── piñata pull-rope, fixed top-right, always visible ── */
        .pull-rope-wrap {
          position: fixed;
          top: 0;
          right: 20px;
          z-index: 100000;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none; /* re-enabled on the handle itself */
        }

        .pull-rope-anchor {
          width: 26px;
          height: 14px;
          background: #6b4a2f;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }

        .pull-rope-string {
          width: 5px;
          background: repeating-linear-gradient(
            to bottom,
            #d8c190 0px,
            #d8c190 6px,
            #b89a63 6px,
            #b89a63 12px
          );
          border-radius: 3px;
          transition: height 0.12s linear;
          box-shadow: 0 0 4px rgba(0,0,0,0.15);
        }

        .pull-rope-handle {
          margin-top: -2px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #ff5fa8, var(--pink-glow));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: grab;
          pointer-events: auto;
          box-shadow: 0 6px 18px rgba(219,39,119,0.45), inset 0 2px 4px rgba(255,255,255,0.4);
          transition: transform 0.05s linear, box-shadow 0.2s;
          user-select: none;
          touch-action: none;
        }

        .pull-rope-handle:hover {
          box-shadow: 0 8px 22px rgba(219,39,119,0.6), inset 0 2px 4px rgba(255,255,255,0.5);
        }

        .pull-rope-handle.dragging {
          cursor: grabbing;
        }

        @keyframes ropeBreathe {
          0%, 100% { transform: translate(-50%, 0px) scale(1); box-shadow: 0 6px 18px rgba(219,39,119,0.45), inset 0 2px 4px rgba(255,255,255,0.4); }
          50%      { transform: translate(-50%, 0px) scale(1.08); box-shadow: 0 8px 26px rgba(219,39,119,0.65), inset 0 2px 4px rgba(255,255,255,0.5); }
        }

        .pull-rope-handle.idle {
          animation: ropeBreathe 1.8s ease-in-out infinite;
        }

        .pull-rope-handle.idle:hover {
          animation-play-state: paused;
        }

        @keyframes ropeSpringBack {
          0%   { transform: translate(-50%, var(--from)) scale(1); }
          40%  { transform: translate(-50%, -10px) scale(1.08); }
          70%  { transform: translate(-50%, 4px) scale(0.97); }
          100% { transform: translate(-50%, 0px) scale(1); }
        }

        .pull-rope-handle.triggered {
          animation: ropeSpringBack 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .pull-rope-ring {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.85);
          margin-bottom: 2px;
        }

        .pull-rope-label {
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          text-align: center;
          line-height: 1.1;
        }

        /* ── wiggle on hover for lab + hero buttons ── */
        @keyframes btnWiggle {
          0%,100% { transform: rotate(0deg) scale(1); }
          25%      { transform: rotate(-3deg) scale(1.04); }
          75%      { transform: rotate(3deg) scale(1.04); }
        }
        .lab-btn:hover, .hero-btn:hover { animation: btnWiggle 0.4s ease-in-out; }

        /* ── result box reveal ── */
        @keyframes resultReveal {
          0%   { opacity: 0; transform: translateY(10px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .result-box { animation: resultReveal 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        .animated-bg {
          background: linear-gradient(-45deg, #2d012d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        .navbar { display: flex; align-items: center; padding: 0 5%; height: 90px; position: fixed; width: 100%; top: 0; z-index: 1000; transition: 0.4s; background: white; justify-content: space-between; }
        .navbar.scrolled { background: #fdfdff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 80px; }
        
        .nav-logo { font-family: 'Lobster', cursive; font-size: 2.7rem; color: var(--deep-purple); text-decoration: none; min-width: 180px; }
        
        .nav-sections { flex: 1; display: flex; justify-content: center; gap: 30px; }
        .nav-pages { display: flex; gap: 25px; align-items: center; min-width: 400px; justify-content: flex-end; }

        .navbar a { text-decoration: none; color: var(--deep-purple); font-weight: 700; transition: 0.3s; cursor: pointer; position: relative; padding: 5px 0; }
        .navbar a:hover { color: var(--pink-glow); }

        .navbar a.active-link { color: var(--pink-glow) !important; }
        .navbar a.active-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px; background: var(--pink-glow); border-radius: 10px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imgFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }

        .page-header {
          padding: 160px 8% 100px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          color: white;
          overflow: hidden;
          position: relative;
          min-height: 88vh;
        }

        /* ── hero background video ── */
        .hero-video-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .hero-video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(-45deg, rgba(45,1,45,0.85), rgba(61,0,61,0.8), rgba(24,75,99,0.75), rgba(45,0,45,0.85));
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
          z-index: 1;
        }

        .hero-text-side, .hero-image-side {
          position: relative;
          z-index: 4;
        }

        .hero-text-side { animation: fadeUp 0.8s ease both; }

        .hero-eyebrow {
          display: inline-block;
          background: rgba(255,221,0,0.15);
          border: 1px solid rgba(255,221,0,0.4);
          color: var(--bright-yellow);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 30px;
          margin-bottom: 22px;
        }

        .hero-h1 {
          font-size: clamp(3rem, 5.5vw, 5rem);
          font-weight: 900;
          line-height: 1.08;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .highlight { color: var(--bright-yellow); }

        .hero-desc {
          font-size: 1.05rem;
          opacity: 0.72;
          line-height: 1.8;
          max-width: 400px;
          margin-bottom: 36px;
        }

        .hero-btn {
          display: inline-block;
          background: var(--bright-yellow);
          color: var(--deep-purple);
          padding: 14px 34px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 0.95rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 24px rgba(255,221,0,0.3);
        }
        .hero-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,221,0,0.45); }

        .hero-image-side {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeUp 0.8s ease 0.2s both;
        }

        .hero-img-wrap {
          position: relative;
          width: 460px;
          height: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: imgFloat 5s ease-in-out infinite;
        }

        .hero-img-wrap {
          position: relative;
          width: 460px;
          height: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: imgFloat 5s ease-in-out infinite;
          overflow: visible;
        }

        .hero-emoji-video-clip {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
          overflow: visible;
        }

        .hero-emoji-video-clip video {
          position: absolute;
          /* shift up to crop the watermark off the top of the source clip */
          top: -16%;
          left: 0;
          width: 100%;
          height: 132%;
          object-fit: contain;
          /* screen blend turns the clip's black background transparent
             against the dark hero, leaving only the bright emojis visible */
          mix-blend-mode: screen;
        }

        /* ── wavy section dividers ── */
        .section-wave {
          display: block;
          width: 100%;
          line-height: 0;
          position: relative;
          z-index: 5;
        }
        .section-wave svg { display: block; width: 100%; height: 60px; }

        /* ── floating background emojis (Lab / Stories / Footer) ── */
        .floating-emoji-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes floatDrift {
          0%   { transform: translate(0, 0) rotate(0deg); }
          50%  { transform: translate(var(--fx), var(--fy)) rotate(var(--frot)); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .floating-emoji-piece {
          position: absolute;
          animation: floatDrift ease-in-out infinite;
          will-change: transform;
        }

        /* ── character video critters ──────────────────────────── */

        /* cat.mp4 — laughing cat, drifting down from the top at low opacity */
        @keyframes catDropFall {
          0%   { transform: translateY(-120%) rotate(-4deg); opacity: 0; }
          12%  { opacity: 0.6; }
          50%  { transform: translateY(40%) rotate(3deg); opacity: 0.6; }
          88%  { opacity: 0.6; }
          100% { transform: translateY(160%) rotate(-2deg); opacity: 0; }
        }
        .critter-cat-drop {
          position: absolute;
          top: 0;
          width: 220px;
          height: 220px;
          object-fit: contain;
          pointer-events: none;
          z-index: 2;
          mix-blend-mode: multiply;
          animation: catDropFall 9s ease-in-out infinite;
        }

        /* catto.mp4 — cat peeking up from the floor of a section */
        @keyframes cattoPeekUp {
          0%, 100% { transform: translateY(78%); }
          50%      { transform: translateY(8%); }
        }
        .critter-catto-peek {
          position: absolute;
          bottom: 0;
          width: 240px;
          height: 240px;
          object-fit: contain;
          pointer-events: none;
          z-index: 2;
          animation: cattoPeekUp 6s ease-in-out infinite;
        }

        /* girl.mp4 — standing character, gentle idle bob, no horizontal walk */
        @keyframes girlIdleBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .critter-girl-standing {
          position: absolute;
          bottom: 0;
          width: 330px;
          height: 430px;
          object-fit: contain;
          object-position: bottom;
          pointer-events: none;
          z-index: 2;
          animation: girlIdleBob 4s ease-in-out infinite;
        }

        /* bunny.mp4 — surprised bunny, pops up and shrinks back down */
        @keyframes bunnyPopSurprise {
          0%, 70%, 100% { transform: scale(0.92) translateY(6px); }
          80%           { transform: scale(1.08) translateY(-6px); }
          88%           { transform: scale(0.97) translateY(2px); }
        }
        .critter-bunny-pop {
          position: absolute;
          bottom: 0;
          width: 240px;
          height: 240px;
          object-fit: contain;
          pointer-events: none;
          z-index: 2;
          animation: bunnyPopSurprise 5s ease-in-out infinite;
        }

        /* rabbit.mp4 — white rabbit holding a radio, real walk, LEFT to RIGHT
           (placed only on dark backgrounds so the white fur reads clearly) */
        @keyframes walkLeftToRight {
          0%   { left: -160px; }
          100% { left: 100%; }
        }
        .critter-rabbit-walk {
          position: absolute;
          bottom: -40px;
          width: 220px;
          height: 220px;
          object-fit: contain;
          pointer-events: none;
          z-index: 3;
          animation: walkLeftToRight 17s linear infinite;
        }

        /* robot.mp4 — 2D robot, real walk, RIGHT to LEFT */
        @keyframes walkRightToLeft {
          0%   { left: 100%; }
          100% { left: -160px; }
        }
        .critter-robot-walk {
          position: absolute;
          bottom: -40px;
          width: 220px;
          height: 220px;
          object-fit: contain;
          pointer-events: none;
          z-index: 3;
          animation: walkRightToLeft 15s linear infinite;
        }

        .lab-section { padding: 60px 5%; background: #fff; text-align: center; position: relative; overflow: hidden; }
        .lab-container { background: #f0f0f0; border-radius: 40px; padding: 50px 5%; max-width: 1100px; margin: 0 auto; box-shadow: 0 15px 35px rgba(0,0,0,0.05); border: 1px solid #ececef; position: relative; overflow: hidden; z-index: 1; }
        
        .lab-tabs { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; }
        .tab-btn { background: #ddd; border: none; padding: 10px 25px; border-radius: 30px; cursor: pointer; font-weight: 800; transition: 0.3s; }
        .tab-btn.active { background: var(--pink-glow); color: white; }

        .lab-card-animated { background: linear-gradient(-45deg, #2d012d, #4a0e4e, #1e3a5f, #2d002d); background-size: 400% 400%; max-width: 600px; margin: 0 auto; animation: movingGradient 8s infinite; color: white !important; padding: 40px; border-radius: 25px; display: flex; flex-direction: column; position: relative; }

        .lab-input, .lab-textarea { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 15px; outline: none; background: rgba(255,255,255,0.9); color: #333; }
        .lab-btn { background: var(--bright-yellow); color: var(--deep-purple); padding: 14px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: 0.3s; margin-top: 10px; }
        .result-box { margin-top: 20px; padding: 15px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }
        .result-label { font-size: 0.62rem; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--bright-yellow); opacity: 0.8; margin-bottom: 8px; display: block; }

        /* ── Vault Filters ── */
        .vault-filters { display: flex; justify-content: center; gap: 10px; margin-bottom: 50px; flex-wrap: wrap; }
        .filter-pill {
          padding: 7px 20px;
          border-radius: 6px;
          border: 1.5px solid #e5e7eb;
          background: white;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #777;
          letter-spacing: 0.03em;
        }
       
        /* ── Toast ── */
        .share-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--deep-purple);
          color: var(--bright-yellow);
          padding: 12px 28px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.9rem;
          z-index: 9999;
          animation: toastIn 0.3s ease;
          box-shadow: 0 8px 24px rgba(45,0,45,0.3);
          white-space: nowrap;
        }

        .footer { color: white; padding: 80px 5% 40px; position: relative; overflow: hidden; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 50px; position: relative; z-index: 1; }
      `}</style>

      {shareToast && <div className="share-toast">{shareToast}</div>}

      {pageBurst.length > 0 && (
        <div className={`page-burst-layer ${pageBurstWiping ? 'wiping' : ''}`}>
          {pageBurst.map(p => (
            <span
              key={p.id}
              className="page-burst-piece"
              style={{
                left: `${p.originX}px`,
                top: `${p.originY}px`,
                fontSize: `${p.size}px`,
                '--bdx': `${p.burstDx}px`,
                '--bdy': `${p.burstDy}px`,
                '--brot': `${p.rot}deg`,
                '--bounce': `${p.bounceHeight}px`,
                animationDelay: `${p.delay}s`
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="pull-rope-wrap" aria-label="Pull for a surprise">
        <div className="pull-rope-anchor" />
        <div
          className="pull-rope-string"
          style={{ height: `${56 + ropePull}px` }}
        />
        <div
          className={`pull-rope-handle ${ropeDragging ? 'dragging' : ''} ${ropeTriggered ? 'triggered' : ''} ${!ropeDragging && !ropeTriggered && ropePull === 0 ? 'idle' : ''}`}
          style={{ transform: `translate(-50%, ${ropePull}px)` }}
          onMouseDown={(e) => handleRopeDragStart(e.clientY)}
          onTouchStart={(e) => handleRopeDragStart(e.touches[0].clientY)}
        >
          <span className="pull-rope-label">PULL<br/>ME</span>
        </div>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Lollify</Link>
        <div className="nav-sections">
          <a href="#lab" className={activeSection === "lab" ? "active-link" : ""}>Comedy Lab</a>
          <a href="#trending" className={activeSection === "trending" ? "active-link" : ""}>Trending</a>
        </div>
        <div className="nav-pages">
          <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>Home</Link>
          <Link to="/text-humor" className={location.pathname === "/text-humor" ? "active-link" : ""}>Text Humor</Link>
          <Link to="/gif-caption" className={location.pathname === "/gif-caption" ? "active-link" : ""}>Gif Caption</Link>
          <Link to="/gif-prompt" className={location.pathname === "/gif-prompt" ? "active-link" : ""}>Gif Prompt</Link>
        </div>
      </nav>

      <header className="page-header">
        <video
          ref={heroVideoRef}
          className="hero-video-bg"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-video-overlay" />

        <div className="hero-text-side">
          <span className="hero-eyebrow">✦ Words, Weaponized</span>
          <h1 className="hero-h1">
            The Humor<br /><span className="highlight">Vault</span>
          </h1>
          <p className="hero-desc">
            A highly classified stash of jokes, stories, and AI-powered punchlines. No dad-joke clearance required.
          </p>
          <a href="#trending" className="hero-btn">Browse Stories →</a>
        </div>

        <div className="hero-image-side">
          <div className="hero-img-wrap">
            <div className="hero-emoji-video-clip">
              <video
                ref={emojiHeroVideoRef}
                src={emojiHeroVideo}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </header>

      <SectionWave fromColor="#2d002d" toColor="#ffffff" />

      <section id="lab" className="lab-section">
        <FloatingEmojis emojis={["😂", "🤣", "😆", "🧪", "✨", "😜"]} count={12} opacity={0.45} />

        {/* cat.mp4 — laughing cat drifting down through the section at low opacity */}
        <video
          className="critter-cat-drop"
          src={catVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{ left: '8%' }}
        />

        {/* girl.mp4 — standing character, bobbing gently in the corner */}
        <video
          className="critter-girl-standing"
          src={girlVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{ right: '3%' }}
        />

        {/* bunny.mp4 — surprised bunny popping up near the lab card */}
        <video
          className="critter-bunny-pop"
          src={bunnyVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{ left: '4%' }}
        />

        <div className="lab-container">
          {labConfetti.map(p => (
            <span
              key={p.id}
              className="lab-confetti-piece"
              style={{
                '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg`,
                animationDelay: `${p.delay}s`
              }}
            >
              {p.emoji}
            </span>
          ))}
          <h2 style={{fontSize: '2.5rem', color: 'var(--deep-purple)', marginBottom: '8px'}}>The Comedy <span style={{color: 'var(--pink-glow)'}}>Lab</span></h2>
          <p style={{color: '#888', fontSize: '0.95rem', marginBottom: '30px'}}>Mix two random words or feed it a headline. No safety goggles required.</p>
          <div className="lab-tabs">
            <button className={`tab-btn ${activeMode === 'words' ? 'active' : ''}`} onClick={() => setActiveMode('words')}>Word Alchemy</button>
            <button className={`tab-btn ${activeMode === 'headlines' ? 'active' : ''}`} onClick={() => setActiveMode('headlines')}>News Headline</button>
          </div>
          {activeMode === 'words' ? (
            <div className="lab-card-animated">
              <form onSubmit={generateWordJoke}>
                <input className="lab-input" placeholder="First word (the weirder the better)..." value={word1} onChange={(e) => setWord1(e.target.value)} required />
                <input className="lab-input" placeholder="Second word (its unlikely soulmate)..." value={word2} onChange={(e) => setWord2(e.target.value)} required />
                <button type="submit" className="lab-btn">{isGeneratingWord ? wordLoadingPhrase : "Combine & Combust 🧪"}</button>
              </form>
              {wordJoke && (
                <div className="result-box">
                  <span className="result-label">Alchemy successful</span>
                  {wordJoke}
                </div>
              )}
            </div>
          ) : (
            <div className="lab-card-animated">
              <form onSubmit={generateHeadlineJoke}>
                <textarea className="lab-textarea" rows="4" placeholder="Paste a news headline. We promise to take it less seriously than the journalist did..." value={headline} onChange={(e) => setHeadline(e.target.value)} required />
                <button type="submit" className="lab-btn">{isGeneratingHeadline ? headlineLoadingPhrase : "Generate Punchline 📰"}</button>
              </form>
              {headlineJoke && (
                <div className="result-box">
                  <span className="result-label">Breaking (not really) news</span>
                  {headlineJoke}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <SectionWave fromColor="#ffffff" toColor="#fafafa" />

{/* Latest Stories Section */}
      <section id="trending" style={{padding: '90px 5%', background: '#fafafa', position: 'relative', overflow: 'hidden'}}>
        <FloatingEmojis emojis={["😹", "🎉", "🙌", "⭐", "😂", "🥳"]} count={12} opacity={0.4} />

        {/* catto.mp4 — cat peeking up from the floor of this section */}
        <video
          className="critter-catto-peek"
          src={cattoVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{ right: '6%' }}
        />

        <div style={{maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1}}>

          {/* Section header */}
          <div style={{marginBottom: '48px'}}>
            <p style={{fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pink-glow)', marginBottom: '10px'}}>Highly Questionable Picks</p>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
              <h2 style={{fontSize: '2.6rem', fontWeight: '900', color: 'var(--deep-purple)', lineHeight: 1.1}}>
                Latest <span style={{color: 'var(--pink-glow)'}}>Stories</span>
              </h2>
              <p style={{color: '#aaa', fontSize: '0.85rem', fontWeight: '600'}}>Click a card. We dare you.</p>
            </div>
            <div style={{width: '48px', height: '4px', background: 'var(--bright-yellow)', borderRadius: '2px', marginTop: '16px'}} />
          </div>

        

        <StorySlider handleShare={handleShare} />

          
        </div>
      </section>

      <SectionWave fromColor="#fafafa" toGradient />

      <footer className="footer animated-bg">
        <FloatingEmojis emojis={["✨", "😂", "🎉", "🤣", "🙌"]} count={10} opacity={0.35} sizeMin={20} sizeMax={38} />

        {/* rabbit.mp4 — white rabbit holding a radio, walks LEFT to RIGHT
            (footer is the dark background it needs to read against) */}
        <video
          className="critter-rabbit-walk"
          src={rabbitVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* robot.mp4 — 2D robot, walks RIGHT to LEFT across the same floor */}
        <video
          className="critter-robot-walk"
          src={robotVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="footer-grid">
          <div>
            <h3 className="nav-logo" style={{color:'white'}}>Lollify</h3>
            <p style={{opacity:'0.8', marginTop:'15px'}}>Making the world brighter, one punchline at a time.</p>
          </div>
          <div>
            <h4 className="highlight">Explore</h4>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'15px'}}>
              <Link to="/" style={{color:'white', textDecoration:'none'}}>Home</Link>
              <Link to="/text-humor" style={{color:'white', textDecoration:'none'}}>Text Humor</Link>
              <Link to="/gif-caption" style={{color:'white', textDecoration:'none'}}>Gif Caption</Link>
              <Link to="/gif-prompt" style={{color:'white', textDecoration:'none'}}>Gif Prompt</Link>
            </div>
          </div>
          <div>
            <h4 className="highlight">Newsletter</h4>
            <p style={{fontSize:'0.9rem', margin:'15px 0'}}>Get the week's best jokes, zero spam, mild dad energy.</p>
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
                style={{padding:'10px 20px', borderRadius:'8px', border:'none', background:'var(--bright-yellow)', fontWeight:'bold', color: 'var(--deep-purple)', cursor: 'pointer', opacity: newsletterStatus === "sending" ? 0.7 : 1}}
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
        <p style={{textAlign:'center', marginTop:'60px', opacity:0.6}}>© 2026 Lollify — Designed for Comedy & Code</p>
      </footer>
    </div>
  );
};

export default TextHumor;