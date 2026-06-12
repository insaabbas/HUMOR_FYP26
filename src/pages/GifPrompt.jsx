import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avatar from "../assets/avatar.png";

const GifPrompt = () => {
  const [scrolled, setScrolled] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [gifFile, setGifFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [joke, setJoke] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGifUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGifFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const generateJoke = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setJoke("");

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      if (gifFile) {
        formData.append("gif", gifFile);
      }

      const response = await fetch("http://127.0.0.1:5000/api/gif-joke", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setJoke(data.joke || data.error || "AI couldn’t generate 😅");

    } catch (error) {
      console.log(error);
      setJoke("Server error ❌");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="lollify-app">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;700;900&display=swap');

        :root {
          --deep-purple: #2d002d;
          --bright-yellow: #facc15;
          --pink-glow: #db2777;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; }

        @keyframes movingGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-bg {
          background: linear-gradient(-45deg, #2d002d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          height: 90px;
          position: fixed;
          width: 100%;
          top: 0;
          background: white;
          z-index: 1000;
        }

        .nav-logo {
          font-family: 'Lobster';
          font-size: 2.7rem;
          color: var(--deep-purple);
          text-decoration: none;
        }

        .nav-pages {
          display: flex;
          gap: 25px;
        }

        .navbar a {
          text-decoration: none;
          color: var(--deep-purple);
          font-weight: 700;
        }

        .navbar a.active-link {
          color: var(--pink-glow);
        }

        .page-header {
          padding: 150px 5% 80px;
          text-align: center;
          color: white;
        }

        .hero-h1 {
          font-size: clamp(2.8rem, 8vw, 4.5rem);
          font-weight: 900;
        }

        .highlight {
          color: var(--bright-yellow);
        }

        /* ✅ AVATAR FIXED (NO SHAPE) */
        .avatar-container {
          text-align: center;
          margin-top: 20px;
        }

        .avatar {
          width: 340px;
          height: auto;
          display: block;
          margin: 0 auto;
          animation: floatAvatar 3s ease-in-out infinite;
        }

        @keyframes floatAvatar {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        .lab-section {
          padding: 80px 5%;
          text-align: center;
        }

        .lab-container {
          background: #f0f0f0;
          border-radius: 40px;
          padding: 60px 5%;
          max-width: 1100px;
          margin: auto;
        }

        .lab-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 40px;
        }

        .lab-card {
          background: linear-gradient(-45deg, #2d002d, #4a0e4e);
          color: white;
          padding: 30px;
          border-radius: 25px;
        }

        .upload-btn {
          display: inline-block;
          background: var(--bright-yellow);
          color: var(--deep-purple);
          padding: 14px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        .lab-textarea {
          width: 100%;
          padding: 15px;
          margin: 15px 0;
          border-radius: 10px;
          border: none;
        }

        .lab-btn {
          background: var(--bright-yellow);
          padding: 15px;
          border: none;
          border-radius: 10px;
          font-weight: 900;
          width: 100%;
          cursor: pointer;
        }

        .result-box {
          margin-top: 20px;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
        }

        img.preview {
          width: 100%;
          margin-top: 10px;
          border-radius: 15px;
        }

        .footer {
          color: white;
          padding: 80px 5% 40px;
          border-top: 6px solid var(--bright-yellow);
          margin-top: 100px;
          background: linear-gradient(-45deg, #2d002d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr;
          gap: 50px;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">Lollify</Link>

        <div className="nav-pages">
          <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>Home</Link>
          <Link to="/text-humor">Text Humor</Link>
          <Link to="/gif-caption">Gif Caption</Link>
          <Link to="/gif-prompt" className="active-link">Gif Prompt</Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="page-header animated-bg">
        <h1 className="hero-h1">
          Gifify & <span className="highlight">Laughify</span>
        </h1>

        {/* ✅ AVATAR */}
        <div className="avatar-container">
          <img className="avatar" src={avatar} alt="avatar" />
        </div>

        <p style={{marginTop: '20px', fontSize: '1.2rem', opacity: 0.9}}>
          Upload a GIF, hit generate, and let the fun begin! 😄
        </p>
      </header>

      {/* LAB */}
      <section className="lab-section">
        <div className="lab-container">
          <h2 style={{fontSize:'2.5rem'}}>
            The Comedy <span style={{color:'var(--pink-glow)'}}>Lab</span>
          </h2>

          <div className="lab-grid">

            <div className="lab-card">
              <h3>🎬 Choose GIF</h3>

              <label className="upload-btn">
                Upload GIF
                <input type="file" accept="image/gif" hidden onChange={handleGifUpload} />
              </label>

              {preview && <img src={preview} className="preview" />}
            </div>

            <div className="lab-card">
              <h3>✍️ Generate Joke</h3>

              <form onSubmit={generateJoke}>
                <textarea
                  placeholder="Write prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="lab-textarea"
                  required
                />

                <button className="lab-btn">
                  {isGenerating ? "Generating..." : "Generate AI Joke"}
                </button>
              </form>

              {joke && <div className="result-box">{joke}</div>}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default GifPrompt;