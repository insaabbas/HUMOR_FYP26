import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import laughEmoji from '../assets/emojis/laugh.png';

const Home = () => {
  // --- LOCAL DATA ---
  const localJokes = [
    { setup: "Why did the computer show up late to work?", punchline: "Because it had a hard drive!" },
    { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" }
  ];

  // --- STATE MANAGEMENT ---
  const [jokeCount] = useState(1080); 
  const [dailyJoke, setDailyJoke] = useState({ setup: "Loading...", punchline: "..." });
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const location = useLocation();

  // --- MODEL CONNECTION LOGIC ---
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
        @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Poppins:wght@400;700;900&display=swap');
        
        :root {
          --deep-purple: #2d002d;
          --bright-yellow: #ffdd00;
          --pink-glow: #db2777;
          --glass: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; overflow-x: hidden; background: #fff; }
        html { scroll-behavior: smooth; }

        @keyframes movingGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floating {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .animated-bg {
          background: linear-gradient(-45deg, #2d012d, #3d003d, #184b63, #2d002d);
          background-size: 400% 400%;
          animation: movingGradient 12s infinite;
        }

        /* Navbar Layout */
        .navbar { display: flex; align-items: center; padding: 0 5%; height: 90px; position: fixed; width: 100%; top: 0; z-index: 1000; transition: 0.4s; background: white; justify-content: space-between; }
        .navbar.scrolled { background: #fdfdff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .nav-logo { font-family: 'Lobster', cursive; font-size: 2.7rem; color: var(--deep-purple); text-decoration: none; min-width: 150px; }
        .nav-sections { display: flex; gap: 30px; flex: 1; justify-content: center; }
        .nav-pages { display: flex; gap: 25px; align-items: center; min-width: 300px; justify-content: flex-end; }
        .navbar a { text-decoration: none; color: var(--deep-purple); font-weight: 700; transition: 0.3s; position: relative; padding: 5px 0; }
        .navbar a:hover { color: var(--pink-glow); }
        .navbar a.active-link { color: var(--pink-glow) !important; }
        .navbar a.active-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px; background: var(--pink-glow); border-radius: 10px; }

        /* Hero Styling */
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; color: white; position: relative; padding: 0 5%; overflow: hidden; }
        .hero-content { z-index: 10; position: relative; }
        .hero-h1 { font-size: clamp(2.8rem, 8vw, 4.8rem); font-weight: 900; line-height: 1.3; letter-spacing: -1.5px; text-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .highlight { color: var(--bright-yellow); display: block; margin-top: 5px; }
        .cta-btn { margin-top: 40px; padding: 16px 45px; border-radius: 50px; border: none; background: var(--bright-yellow); color: var(--deep-purple); font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .cta-btn:hover { transform: translateY(-3px) scale(1.05); background: white; box-shadow: 0 15px 30px rgba(0,0,0,0.3); }

        /* Emoji absolute positioning with gaps */
        .floating-emoji { position: absolute; animation: floating 4s ease-in-out infinite; z-index: 1; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3)); pointer-events: none; }
        
        .emoji-big { 
            width: 200px; 
            right: 5%; 
            top: 35%; 
            transform: translateY(-50%);
        }
        
        .emoji-small-top { 
            width: 80px; 
            right: 5%; 
            top: 25%; 
            animation-delay: 2.5s; 
        }
        
        .emoji-small-bottom { 
            width: 150px; 
            right: 8%; 
            bottom: 5%; 
            animation-delay: 1.2s; 
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .nav-sections { display: none; }
          .emoji-big { width: 150px; right: 2%; top: 20%; }
          .emoji-small-top, .emoji-small-bottom { display: none; }
        }

        /* Other sections remains same */
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

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Lollify</Link>
        <div className="nav-sections">
          <a href="#hero" className={activeSection === "hero" ? "active-link" : ""}>Welcome</a>
          <a href="#joke-of-day" className={activeSection === "joke-of-day" ? "active-link" : ""}>Daily Joke</a>
          <a href="#about" className={activeSection === "about" ? "active-link" : ""}>About</a>
          <a href="#contact" className={activeSection === "contact" ? "active-link" : ""}>Contact</a>
        </div>
        <div className="nav-pages">
          <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>Home</Link>
          <Link to="/text-humor" className={location.pathname === "/text-humor" ? "active-link" : ""}>Text Humor</Link>
          <Link to="/gif-caption" className={location.pathname === "/gif-caption" ? "active-link" : ""}>Gif Caption</Link>
          <Link to="/gif-prompt" className={location.pathname === "/gif-prompt" ? "active-link" : ""}>Gif Prompt</Link>
        </div>
      </nav>

      <section id="hero" className="hero animated-bg">
        {/* Images spaced out with gaps on the right side */}
        <img src={laughEmoji} alt="" className="floating-emoji emoji-small-top" />
        <img src={laughEmoji} alt="" className="floating-emoji emoji-big" />
        <img src={laughEmoji} alt="" className="floating-emoji emoji-small-bottom" />

        <div className="hero-content">
          <h1 className="hero-h1">Laughter is the<br/><span className="highlight">Best Medicine</span></h1>
          <p style={{marginTop:'25px', fontSize:'1.3rem'}}>Commit your laughs, push your worries.</p>
          <a href="#joke-of-day"><button className="cta-btn">Start Laughing</button></a>
        </div>
      </section>

      <section id="joke-of-day" className="section-padding">
        <div className="outer-container">
          <h2 style={{fontSize:'3rem', color: '#2d002d'}}>Joke of the <span style={{color: 'var(--pink-glow)'}}>Day</span></h2>
          <div className="joke-card animated-bg">
            <p className="joke-text">{dailyJoke.setup}</p>
            <p className="punchline-text">{dailyJoke.punchline}</p>
            <button className="refresh-btn" onClick={fetchRandomJoke}>
              {loadingJoke ? "Brewing humor..." : "Give me another!"}
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="section-padding about-bg animated-bg">
        <h2 style={{fontSize:'3rem'}}>What is <span className="highlight">Lollify?</span></h2>
        <p style={{maxWidth:'700px', margin:'20px auto', opacity:'0.9'}}>We built a sanctuary for dad jokes and puns. No grumpiness allowed!</p>
        <div className="stats">
          <div className="stat-card"><h3>99%</h3><p>Better Moods</p></div>
          <div className="stat-card"><h3>{jokeCount}</h3><p>Jokes in Library</p></div>
          <div className="stat-card"><h3>1%</h3><p>Snorts</p></div>
        </div>
      </section>

      <section id="contact" className="section-padding">
        <div className="outer-container">
          <h2 style={{fontSize:'3rem', color: '#2d002d'}}>The Contact <span style={{fontStyle:'italic', color:'#db2777'}}>Mixer</span></h2>
          <div className="contact-grid">
            <div className="form-box animated-bg">
              <h3 className="highlight">Don't be a Stranger!</h3>
              <p style={{marginTop:'15px', color: 'white'}}>Drop us a line or share a joke.</p>
              <div style={{marginTop:'40px', padding:'20px', background:'rgba(0,0,0,0.2)', borderRadius:'15px', color: 'white'}}>
                📩 We reply faster than a dad can say "Hi Hungry, I'm Dad."
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
                <div style={{textAlign:'center', padding:'40px 0'}}><h2>Boom! Sent. 💥</h2><button onClick={() => setSubmitted(false)} className="cta-btn">Send Another</button></div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer animated-bg">
        <div className="footer-grid">
          <div><h3 className="nav-logo" style={{color:'white'}}>Lollify</h3><p style={{opacity:'0.8', marginTop:'15px'}}>Making the world brighter, one punchline at a time.</p></div>
          <div><h4 className="highlight">Explore</h4><div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'15px'}}>
              <a href="#hero" style={{color:'white', textDecoration:'none'}}>Welcome</a>
              <a href="#about" style={{color:'white', textDecoration:'none'}}>About</a>
              <a href="#contact" style={{color:'white', textDecoration:'none'}}>Contact</a>
          </div></div>
          <div><h4 className="highlight">Newsletter</h4><p style={{fontSize:'0.9rem', margin:'15px 0'}}>Get the week's best jokes.</p><div style={{display:'flex', gap:'5px'}}><input type="email" placeholder="Email" style={{padding:'10px', borderRadius:'8px', border:'none', flex:1}} /><button style={{padding:'10px 20px', borderRadius:'8px', border:'none', background:'var(--bright-yellow)', fontWeight:'bold', color:'var(--deep-purple)'}}>Join</button></div></div>
        </div>
        <p style={{textAlign:'center', marginTop:'60px', opacity:0.6}}>© 2026 Lollify — Designed for Comedy & Code</p>
      </footer>
    </div>
  );
};

export default Home;