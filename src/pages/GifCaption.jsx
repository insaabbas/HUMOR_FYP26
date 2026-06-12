import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import avatar1 from "../assets/avatar1.png"; // Girl
import avatar2 from "../assets/avatar2.png"; // Boy
import funnyGif from "../assets/funny.gif";

const GifCaption = () => {
  const [scrolled, setScrolled] = useState(false);
  const [gifFile, setGifFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const location = useLocation();

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
    if (file && file.type === "image/gif") {
      setGifFile(file);
      setPreview(URL.createObjectURL(file));
      setShowError(false);
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

      const response = await fetch("http://127.0.0.1:5000/predict", {
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
      setCaption("Error: Could not connect to the server 😢. Is app.py running?");
    }

    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    if (caption) {
      navigator.clipboard.writeText(caption);
      alert("Caption copied to clipboard!");
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

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: #fff;
          overflow-x: hidden;
        }

        html {
          scroll-behavior: smooth;
        }

        @keyframes movingGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-bg {
          background: linear-gradient(-45deg, #2d012d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        /* FLOATING AVATAR */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        /* SCROLL DOWN */
        .scroll-down {
          margin-top: 35px;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          cursor: pointer;
          animation: bounce 2s infinite;
          z-index: 20;
        }

        .scroll-down span {
          font-size: 0.95rem;
          opacity: 0.9;
          margin-bottom: 6px;
        }

        .arrow {
          width: 22px;
          height: 22px;
          border-left: 4px solid var(--bright-yellow);
          border-bottom: 4px solid var(--bright-yellow);
          transform: rotate(-45deg);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(10px);
          }
          60% {
            transform: translateY(5px);
          }
        }

        .header-content-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin: 0 auto;
          max-width: 100%;
          z-index: 5;
        }

        .header-text-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 10;
        }

        .avatar {
          height: 180px;
          width: auto;
          object-fit: contain;
          background: transparent;
          border: none;
          border-radius: 0;
          animation: float 3s ease-in-out infinite;
          z-index: 5;
        }

        .avatar-left {
          animation-delay: 1.5s;
        }

        @media (max-width: 768px) {
          .header-content-wrapper {
            flex-direction: column;
            gap: 15px;
          }

          .avatar {
            height: 130px;
          }
        }

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

        .navbar.scrolled {
          background: #fdfdff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          height: 80px;
        }

        .nav-logo {
          font-family: 'Lobster', cursive;
          font-size: 2.7rem;
          color: var(--deep-purple);
          text-decoration: none;
          min-width: 180px;
        }

        .nav-sections {
          flex: 1;
          display: flex;
          justify-content: center;
          gap: 30px;
        }

        .nav-pages {
          display: flex;
          gap: 25px;
          align-items: center;
          min-width: 400px;
          justify-content: flex-end;
        }

        .navbar a {
          text-decoration: none;
          color: var(--deep-purple);
          font-weight: 700;
          transition: 0.3s;
          cursor: pointer;
          position: relative;
          padding: 5px 0;
        }

        .navbar a:hover {
          color: var(--pink-glow);
        }

        .navbar a.active-link {
          color: var(--pink-glow) !important;
        }

        .navbar a.active-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--pink-glow);
          border-radius: 10px;
        }

        .page-header {
          padding: 150px 5% 80px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .hero-h1 {
          font-size: clamp(2.8rem, 7vw, 4.5rem);
          font-weight: 900;
          line-height: 1.2;
          margin: 0;
        }

        .highlight {
          color: var(--bright-yellow);
        }

        .lab-section {
          padding: 80px 5%;
          background: #fff;
          text-align: center;
        }

        .lab-container {
          background: #f0f0f0;
          border-radius: 60px;
          padding: 80px 40px;
          max-width: 1200px;
          margin: 0 auto;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          border: 1px solid #ececef;
        }

        .lab-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 40px;
        }

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

        .lab-card-animated h3 {
          color: var(--bright-yellow);
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .inner-box {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          text-align: center;
          font-weight: 600;
        }

        .inner-box img {
          max-width: 100%;
          max-height: 180px;
          border-radius: 10px;
          object-fit: contain;
        }

        .lab-btn {
          background: var(--bright-yellow);
          color: var(--deep-purple);
          padding: 16px;
          border-radius: 12px;
          border: none;
          font-weight: 800;
          cursor: pointer;
          width: 100%;
          transition: 0.3s;
          margin-top: auto;
        }

        .lab-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 221, 0, 0.3);
        }

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

        .footer {
          color: white;
          padding: 80px 5% 40px;
          border-top: 6px solid var(--bright-yellow);
          margin-top: 100px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr;
          gap: 50px;
        }

        @media (max-width: 1150px) {
          .nav-sections {
            display: none;
          }

          .lab-grid,
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Lollify</Link>

        <div className="nav-sections">
          <a
            href="#lab"
            className={activeSection === "lab" ? "active-link" : ""}
          >
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

      <header className="page-header animated-bg">

        <div className="header-content-wrapper">

          {/* LEFT AVATAR */}
          <img src={avatar2} alt="boy avatar" className="avatar avatar-left" />

          {/* CENTER TEXT */}
          <div className="header-text-column">

            <h1 className="hero-h1">
              GIF Caption <span className="highlight">Wizard</span>
            </h1>

            <p
              style={{
                marginTop: '10px',
                fontSize: '1.2rem',
                opacity: 0.9
              }}
            >
              One upload. One click. Unlimited laughter 😂
            </p>

            {/* SCROLL DOWN */}
            <div
              className="scroll-down"
              onClick={() => {
                document.getElementById("lab").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <span>Scroll Down</span>
              <div className="arrow"></div>
            </div>

          </div>

          {/* RIGHT AVATAR */}
          <img src={avatar1} alt="girl avatar" className="avatar" />

        </div>

      </header>

      {/* LAB SECTION */}
      <section id="lab" className="lab-section">

        <div className="lab-container">

          <h2
            style={{
              fontSize: '3rem',
              color: '#2d002d',
              fontWeight: '700'
            }}
          >
            The AI Caption <span style={{ color: 'var(--pink-glow)' }}>Lab</span>
          </h2>

          <p
            style={{
              color: '#666',
              marginTop: '10px',
              marginBottom: '40px'
            }}
          >
            Combine your favorite GIF with AI to create the perfect joke.
          </p>

          <div className="lab-grid">

            {/* UPLOAD */}
            <div className="lab-card-animated">

              <h3>🎬 Browse & Upload</h3>

              <div
                className="inner-box"
                style={{
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <input
                  type="file"
                  id="gif-upload-input"
                  accept="image/gif"
                  onChange={handleGifUpload}
                  style={{ display: 'none' }}
                />

                <span>
                  {gifFile
                    ? gifFile.name
                    : "Add a GIF & let AI work its magic."}
                </span>
              </div>

              <button
                className="lab-btn"
                onClick={() =>
                  document.getElementById('gif-upload-input').click()
                }
              >
                Select File
              </button>

            </div>

            {/* PREVIEW */}
            <div className="lab-card-animated">

              <h3>🖼️ GIF Preview</h3>

              <div className="inner-box">
                {preview
                  ? <img src={preview} alt="preview" />
                  : "Waiting for upload..."}
              </div>

              {showError && (
                <div className="error-popup">

                  <div
                    style={{
                      background: '#ff6b00',
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      borderRadius: '3px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: '900'
                    }}
                  >
                    !
                  </div>

                  <span>Please upload a GIF first.</span>

                </div>
              )}

              <button
                className="lab-btn"
                onClick={generateCaption}
              >
                {isGenerating
                  ? "Magic in progress..."
                  : "Generate AI Caption"}
              </button>

            </div>

            {/* CAPTION */}
            <div className="lab-card-animated">

              <h3>🤖 Crack a Joke</h3>

              <div className="inner-box">
                {caption || "Get ready to giggle…"}
              </div>

              <button
                className="lab-btn"
                onClick={copyToClipboard}
              >
                Copy Caption
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer animated-bg">

        <div className="footer-grid">

          <div>
            <h3
              className="nav-logo"
              style={{ color: 'white' }}
            >
              Lollify
            </h3>

            <p
              style={{
                opacity: '0.8',
                marginTop: '15px'
              }}
            >
              Making the world brighter, one punchline at a time.
            </p>
          </div>

          <div>

            <h4 className="highlight">Explore</h4>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '15px'
              }}
            >
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>

              <Link to="/text-humor" style={{ color: 'white', textDecoration: 'none' }}>
                Text Humor
              </Link>

              <Link to="/gif-caption" style={{ color: 'white', textDecoration: 'none' }}>
                Gif Caption
              </Link>

              <Link to="/gif-prompt" style={{ color: 'white', textDecoration: 'none' }}>
                Gif Prompt
              </Link>
            </div>

          </div>

          <div>

            <h4 className="highlight">Newsletter</h4>

            <p
              style={{
                fontSize: '0.9rem',
                margin: '15px 0'
              }}
            >
              Get the week's best jokes.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '5px'
              }}
            >
              <input
                type="email"
                placeholder="Email"
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  flex: 1
                }}
              />

              <button
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--bright-yellow)',
                  fontWeight: 'bold',
                  color: 'var(--deep-purple)'
                }}
              >
                Join
              </button>

            </div>

          </div>

        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '60px',
            opacity: 0.6
          }}
        >
          © 2026 Lollify — Designed for Comedy & Code
        </p>

      </footer>

    </div>
  );
};

export default GifCaption;