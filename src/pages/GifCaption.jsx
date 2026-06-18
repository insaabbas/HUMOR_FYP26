import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import avatar1 from "../assets/avatar1.png"; // Girl
import avatar2 from "../assets/avatar2.png"; // Boy
import laughEmoji from '../assets/emojis/laugh.png'; // Added laugh emoji asset

const GifCaption = () => {
  const [scrolled, setScrolled] = useState(false);
  const [gifFile, setGifFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  // Hero section ke liye auto-rotating sample captions state
  const samplePrompts = [
    "POV: Me when my SQL query works on the first try and doesn't return a single error.",
    "Me explaining to my mom why sleeping 12 hours is productive.",
    "That moment when the compiler finally stops screaming at you.",
    "When you open a bag of chips and the whole classroom suddenly looks at you."
  ];
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);

  const location = useLocation();

  // Caption automatic rotate karne ke liye loop effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSampleIndex((prevIndex) => (prevIndex + 1) % samplePrompts.length);
    }, 5000); // Har 5 seconds baad change hoga
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const element = document.getElementById("lab");
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 200) {
          setActiveSection("lab");
        } else {
          setActiveSection("");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGifUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/gif") {
        setGifFile(file);
        setPreview(URL.createObjectURL(file));
        setShowError(false);
      } else {
        alert("Error: Only .gif files are allowed! Please select a valid GIF image.");
        e.target.value = ""; // Clear input selection
      }
    }
  };

  const generateCaption = async () => {
    if (!gifFile) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsGenerating(true);
    setCaption("Sending to AI...");

    try {
      const formData = new FormData();
      formData.append("image", gifFile);

      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setCaption(data.error || "Backend Error: Unknown API Error");
      } else {
        setCaption(data.caption);
      }

    } catch (error) {
      console.error("Error:", error);
      setCaption("Error: Could not connect to the server");
    }

    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    if (caption && caption !== "Sending to AI..." && !caption.startsWith("Error:")) {
      navigator.clipboard.writeText(caption);
      alert("Caption copied to clipboard!");
    } else {
      alert("Error: There is no caption to copy! Please upload a GIF and generate a caption first.");
    }
  };

  const copySampleToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Sample caption copied!");
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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes imgFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }

        .animated-bg {
          background: linear-gradient(-45deg, #2d012d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        /* ── Navbar ── */
        .navbar { 
          display: flex; 
          align-items: center; 
          padding: 0 5%; 
          height: 90px; 
          position: fixed; 
          width: 100%; 
          top: 0; 
          z-index: 1000; 
          transition: 0.4s; 
          background: white; 
          justify-content: space-between; 
        }
        .navbar.scrolled { background: #fdfdff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 80px; }
        
        .nav-logo { 
          font-family: 'Lobster', cursive; 
          font-size: 2.7rem; 
          color: var(--deep-purple); 
          text-decoration: none; 
          min-width: 180px; 
        }
        
        .nav-sections { flex: 1; display: flex; justify-content: center; gap: 30px; }
        .nav-pages { display: flex; gap: 25px; align-items: center; min-width: 400px; justify-content: flex-end; }

        .navbar a { text-decoration: none; color: var(--deep-purple); font-weight: 700; transition: 0.3s; cursor: pointer; position: relative; padding: 5px 0; }
        .navbar a:hover { color: var(--pink-glow); }
        .navbar a.active-link { color: var(--pink-glow) !important; }
        .navbar a.active-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px; background: var(--pink-glow); border-radius: 10px;
        }

        /* ── Modern Split Hero Layout ── */
        .page-header { 
          padding: 160px 8% 100px; 
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center; 
          gap: 60px;
          color: white; 
          position: relative; 
          overflow: hidden; 
          min-height: 88vh;
        }

        .hero-text-side { animation: fadeUp 0.8s ease both; text-align: left; }

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

        .hero-h1 { font-size: clamp(3rem, 5.5vw, 5rem); font-weight: 900; line-height: 1.08; margin-bottom: 20px; letter-spacing: -0.02em; }
        .highlight { color: var(--bright-yellow); }

        .hero-desc {
          font-size: 1.05rem;
          opacity: 0.72;
          line-height: 1.8;
          max-width: 450px;
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
          border: none;
          cursor: pointer;
        }
        .hero-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,221,0,0.45); }

        .hero-image-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: fadeUp 0.8s ease 0.2s both;
          position: relative;
        }

        .hero-img-wrap {
          position: relative;
          width: 480px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          margin-right: auto;
        }

        /* Dual Avatar Scene CSS Setup */
        .avatar-container-scene {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          z-index: 2;
          animation: imgFloat 5s ease-in-out infinite;
        }

        .avatar-element {
          height: 280px; 
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 15px 30px rgba(0,0,0,0.25));
          user-select: none;
        }

        .av-left {
          transform: rotate(-8deg) translateX(25px);
          z-index: 2;
        }

        .av-right {
          transform: rotate(8deg) translateX(-25px);
          z-index: 3;
          margin-top: 30px;
        }

        /* Floating Sample Prompt Speech Bubble Style */
        .sample-prompt-bubble {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 18px 22px;
          position: relative;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          margin-top: -10px;
          z-index: 10;
          animation: imgFloat 5s ease-in-out infinite alternate;
        }

        /* Speech bubble arrow indicator pointers */
        .sample-prompt-bubble::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 45%;
          border-width: 0 12px 12px 12px;
          border-style: solid;
          border-color: transparent transparent rgba(255, 255, 255, 0.15) transparent;
        }

        /* ── Lab & Structure ── */
        .lab-section { padding: 80px 5%; background: #fff; text-align: center; }
        .lab-container { background: #f0f0f0; border-radius: 60px; padding: 80px 40px; max-width: 1200px; margin: 0 auto; box-shadow: 0 15px 35px rgba(0,0,0,0.05); border: 1px solid #ececef; }
        .lab-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; }

        .lab-card-animated {
          background: linear-gradient(-45deg, #2d012d, #4a0e4e, #1e3a5f, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 8s infinite;
          color: white;
          padding: 30px;
          border-radius: 25px;
          display: flex;
          flex-direction: column;
          min-height: 420px;
          position: relative;
        }
        .lab-card-animated h3 { color: white; margin-bottom: 20px; font-size: 1.3rem; }

        .inner-box { 
          background: rgba(255,255,255,0.95); 
          border-radius: 15px; 
          padding: 20px; 
          margin-bottom: 20px; 
          flex: 1; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          color: #333333; 
          text-align: center; 
          font-weight: normal; 
        }
        .inner-box img { max-width: 100%; max-height: 180px; border-radius: 10px; object-fit: contain; }

        .lab-btn { background: var(--bright-yellow); color: var(--deep-purple); padding: 16px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; width: 100%; transition: 0.3s; margin-top: auto; }
        .lab-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 221, 0, 0.3); }

        .error-popup {
          position: absolute;
          bottom: 85px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: #333;
          padding: 10px 15px;
          border-radius: 5px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          width: 90%;
          z-index: 10;
        }

        .footer { color: white; padding: 80px 5% 40px; border-top: 6px solid var(--bright-yellow); margin-top: 100px; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 50px; }

        @media (max-width: 1150px) {
          .nav-sections { display: none; }
          .page-header { grid-template-columns: 1fr; text-align: center; padding-top: 130px; gap: 40px; }
          .hero-text-side { text-align: center; }
          .hero-desc { margin: 0 auto 30px; }
          .lab-grid, .footer-grid { grid-template-columns: 1fr; }
          .hero-image-side { justify-content: center; flex-direction: column; gap: 20px; }
          .hero-img-wrap { width: 100%; max-width: 400px; height: auto; }
          .avatar-element { height: 220px; }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Lollify</Link>
        <div className="nav-sections">
          <a href="#lab" className={activeSection === "lab" ? "active-link" : ""}>
            Laughter Hub
          </a>
        </div>
        <div className="nav-pages">
          <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>Home</Link>
          <Link to="/text-humor" className={location.pathname === "/text-humor" ? "active-link" : ""}>Text Humor</Link>
          <Link to="/gif-caption" className={location.pathname === "/gif-caption" ? "active-link" : ""}>Gif Caption</Link>
          <Link to="/gif-prompt" className={location.pathname === "/gif-prompt" ? "active-link" : ""}>Gif Prompt</Link>
        </div>
      </nav>

      {/* ── SPLIT HERO SECTION WITH AVATARS AND FLOATING SPEECH BUBBLE ── */}
      <header className="page-header animated-bg">
        <div className="hero-text-side">
          <span className="hero-eyebrow">✦ Instant Magic Creator</span>
          <h1 className="hero-h1">
            GIF Caption <br /><span className="highlight">Wizard</span>
          </h1>
          <p className="hero-desc">
            One upload. One click. Unlimited laughter 😂 Transform your standard GIFs into absolute comedic masterpieces instantly with advanced AI.
          </p>
          <button className="hero-btn" onClick={() => document.getElementById('lab')?.scrollIntoView()}>
            Open AI Studio ↓
          </button>
        </div>

        {/* Right Side Visual - Bigger Avatars + Rotating Dialogue Box */}
        <div className="hero-image-side">
          <div className="hero-img-wrap">
            <div className="avatar-container-scene">
              <img src={avatar2} alt="boy avatar" className="avatar-element av-left" />
              <img src={avatar1} alt="girl avatar" className="avatar-element av-right" />
            </div>
          </div>
          
          {/* Glassmorphic Speech Bubble UI Component */}
          <div className="sample-prompt-bubble">
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--bright-yellow)', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                💡 Try a sample caption:
              </span>
              <button 
                onClick={() => copySampleToClipboard(samplePrompts[currentSampleIndex])}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                📋 Copy
              </button>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#ffffff', lineHeight: '1.5', fontStyle: 'italic', transition: 'all 0.5s ease' }}>
              "{samplePrompts[currentSampleIndex]}"
            </p>
          </div>
        </div>
      </header>

      {/* ── AI Caption Lab Section ── */}
      <section id="lab" className="lab-section">
        <div className="lab-container">
          <h2 style={{fontSize: '3rem', color: '#2d002d', fontWeight: '700'}}>
            The AI Caption <span style={{color: 'var(--pink-glow)'}}>Lab</span>
          </h2>
          <p style={{color: '#666', marginTop: '10px', marginBottom: '40px'}}>
            Combine your favorite GIF with AI to create the perfect joke.
          </p>

          <div className="lab-grid">
            <div className="lab-card-animated">
              <h3>Browse & Upload</h3>
              <div className="inner-box" style={{flexDirection: 'column', gap: '10px'}}>
                <input type="file" id="gif-upload-input" accept="image/gif" onChange={handleGifUpload} style={{display: 'none'}} />
                <span style={{color: '#333333'}}>{gifFile ? gifFile.name : "Add a GIF & let AI work its magic."}</span>
              </div>
              <button className="lab-btn" onClick={() => document.getElementById('gif-upload-input').click()}>Select File</button>
            </div>

            <div className="lab-card-animated">
              <h3>GIF Preview</h3>
              <div className="inner-box">
                {preview ? <img src={preview} alt="preview" /> : <span style={{color: '#333333'}}>Waiting for upload...</span>}
              </div>
              {showError && (
                <div className="error-popup">
                  <div style={{background: '#ff6b00', color: 'white', width: '20px', height: '20px', borderRadius: '3px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '900'}}>!</div>
                  <span>Please upload a GIF first.</span>
                </div>
              )}
              <button className="lab-btn" onClick={generateCaption}>
                {isGenerating ? "Magic in progress..." : "Generate AI Caption"}
              </button>
            </div>

            <div className="lab-card-animated">
              <h3>Crack a Joke</h3>
              <div className="inner-box">
                <span style={{color: '#333333'}}>{caption || "Get ready to giggle…"}</span>
              </div>
              <button className="lab-btn" onClick={copyToClipboard}>Copy Caption</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer animated-bg">
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
            <p style={{fontSize:'0.9rem', margin:'15px 0'}}>Get the week's best jokes.</p>
            <div style={{display:'flex', gap:'5px'}}>
              <input type="email" placeholder="Email" style={{padding:'10px', borderRadius:'8px', border:'none', flex:1}} />
              <button style={{padding:'10px 20px', borderRadius:'8px', border:'none', background:'var(--bright-yellow)', fontWeight:'bold', color: 'var(--deep-purple)'}}>Join</button>
            </div>
          </div>
        </div>
        <p style={{textAlign:'center', marginTop:'60px', opacity:0.6}}>© 2026 Lollify — Designed for Comedy & Code</p>
      </footer>
    </div>
  );
};

export default GifCaption;