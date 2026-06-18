import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import kidsLaughImg from '../assets/emojis/kids laugh.png'; 

const TextHumor = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [activeMode, setActiveMode] = useState("words"); 
  
  const [headline, setHeadline] = useState("");
  const [headlineJoke, setHeadlineJoke] = useState("");
  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false);

  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [wordJoke, setWordJoke] = useState("");
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);

  const location = useLocation();

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

  const humorStories = [
    { title: "The Senior Dev's Prayer", content: "Our Father, who art in Silicon Valley, hallowed be thy Code. Thy Kingdom come, thy Bug be fixed, on Localhost as it is in Production.", tag: "Coding" },
    { title: "Internet Logic", content: "I have a 'stable' internet connection. It’s so stable that it hasn't moved or downloaded anything in 20 minutes.", tag: "Tech" },
    { title: "The CSS Marriage", content: "Why did the HTML break up with CSS? Because they just weren't in the same 'class' anymore.", tag: "Coding" },
    { title: "The Gym Membership", content: "I asked my trainer if he could teach me how to do the splits. He asked, 'How flexible are you?' I said, 'I can't make Tuesdays.'", tag: "Life" }
  ];

  const generateHeadlineJoke = async (e) => {
    e.preventDefault();
    setIsGeneratingHeadline(true);
    setHeadlineJoke("");
    try {
      const response = await fetch('http://localhost:5000/api/generate-joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Write a funny punchline for this headline: "${headline}"` }),
      });
      const data = await response.json();
      setHeadlineJoke(data.joke || "The AI is speechless!");
    } catch (error) {
      setHeadlineJoke("Connection error.");
    } finally { setIsGeneratingHeadline(false); }
  };

  const generateWordJoke = async (e) => {
    e.preventDefault();
    setIsGeneratingWord(true);
    setWordJoke("");
    try {
      const response = await fetch('http://localhost:5000/api/generate-joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Create a joke using the words "${word1}" and "${word2}".` }),
      });
      const data = await response.json();
      setWordJoke(data.joke || "The alchemy failed!");
    } catch (error) {
      setWordJoke("Connection error.");
    } finally { setIsGeneratingWord(false); }
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

        /* HEADER LAYOUT: Text Centered, Image Pinned Right */
        .page-header { 
          padding: 150px 5% 80px; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          color: white; 
          overflow: hidden;
          position: relative;
        }
        .hero-text-side { flex: 1; text-align: center; }
        .hero-image-side { position: absolute; right: 3%; top: 60%; transform: translateY(-50%); display: flex; align-items: center; }
        .hero-img-element { max-width: 200px; height: auto;  }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .hero-h1 { font-size: 5rem; font-weight: 900; line-height: 1.1; }
        .highlight { color: var(--bright-yellow); }

        .lab-section { padding: 60px 5%; background: #fff; text-align: center; }
        .lab-container { background: #f0f0f0; border-radius: 40px; padding: 50px 5%; max-width: 1100px; margin: 0 auto; box-shadow: 0 15px 35px rgba(0,0,0,0.05); border: 1px solid #ececef; }
        
        .lab-tabs { display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; }
        .tab-btn { background: #ddd; border: none; padding: 10px 25px; border-radius: 30px; cursor: pointer; font-weight: 800; transition: 0.3s; }
        .tab-btn.active { background: var(--pink-glow); color: white; }

        .lab-card-animated { background: linear-gradient(-45deg, #2d012d, #4a0e4e, #1e3a5f, #2d002d); background-size: 400% 400%; max-width: 600px; margin: 0 auto; animation: movingGradient 8s infinite; color: white !important; padding: 40px; border-radius: 25px; display: flex; flex-direction: column; }

        .lab-input, .lab-textarea { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 15px; outline: none; background: rgba(255,255,255,0.9); color: #333; }
        .lab-btn { background: var(--bright-yellow); color: var(--deep-purple); padding: 14px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: 0.3s; margin-top: 10px; }
        .result-box { margin-top: 20px; padding: 15px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }

        .story-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
        .story-card { background: white; padding: 40px; border-radius: 30px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border-top: 6px solid var(--pink-glow); }

        .footer { color: white; padding: 80px 5% 40px; border-top: 6px solid var(--bright-yellow); margin-top: 100px; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: 50px; }
      `}</style>

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

      <header className="page-header animated-bg">
        <div className="hero-text-side">
          <h1 className="hero-h1">The Humor <span className="highlight">Vault</span></h1>
          <p style={{marginTop: '15px', fontSize: '1.2rem', opacity: 0.9}}>Exclusively curated text-based comedy.</p>
        </div>
        <div className="hero-image-side">
          <img src={kidsLaughImg} alt="Laughing kids" className="hero-img-element" />
        </div>
      </header>

      <section id="lab" className="lab-section">
        <div className="lab-container">
          <h2 style={{fontSize: '2.5rem', color: 'var(--deep-purple)', marginBottom: '30px'}}>The Comedy <span style={{color: 'var(--pink-glow)'}}>Lab</span></h2>
          <div className="lab-tabs">
            <button className={`tab-btn ${activeMode === 'words' ? 'active' : ''}`} onClick={() => setActiveMode('words')}>Word Alchemy</button>
            <button className={`tab-btn ${activeMode === 'headlines' ? 'active' : ''}`} onClick={() => setActiveMode('headlines')}>News Headline</button>
          </div>
          {activeMode === 'words' ? (
            <div className="lab-card-animated">
              <form onSubmit={generateWordJoke}>
                <input className="lab-input" placeholder="First word..." value={word1} onChange={(e) => setWord1(e.target.value)} required />
                <input className="lab-input" placeholder="Second word..." value={word2} onChange={(e) => setWord2(e.target.value)} required />
                <button type="submit" className="lab-btn">{isGeneratingWord ? "Brewing..." : "Generate Word Joke"}</button>
              </form>
              {wordJoke && <div className="result-box">{wordJoke}</div>}
            </div>
          ) : (
            <div className="lab-card-animated">
              <form onSubmit={generateHeadlineJoke}>
                <textarea className="lab-textarea" rows="4" placeholder="Paste a news headline..." value={headline} onChange={(e) => setHeadline(e.target.value)} required />
                <button type="submit" className="lab-btn">{isGeneratingHeadline ? "Scanning..." : "Generate Punchline"}</button>
              </form>
              {headlineJoke && <div className="result-box">{headlineJoke}</div>}
            </div>
          )}
        </div>
      </section>

      <section id="trending" style={{padding: '80px 5%', textAlign: 'center'}}>
        <h2 style={{fontSize:'2.8rem', color: '#2d002d', marginBottom: '40px'}}>Latest <span style={{color: 'var(--pink-glow)'}}>Stories</span></h2>
        <div className="story-grid">
          {humorStories.map((story, index) => (
            <div key={index} className="story-card">
              <span style={{fontSize: '0.8rem', fontWeight: '900', color: 'var(--pink-glow)', textTransform: 'uppercase'}}>{story.tag}</span>
              <h3 style={{margin: '15px 0', color: '#2d002d'}}>{story.title}</h3>
              <p style={{lineHeight: '1.6', color: '#555'}}>{story.content}</p>
            </div>
          ))}
        </div>
      </section>

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

export default TextHumor;