import { useState, useEffect, useRef } from "react";

const humorStories = [
  { title: "The Senior Dev's Prayer", content: "Our Father, who art in Silicon Valley, hallowed be thy Code. Thy Kingdom come, thy Bug be fixed, on Localhost as it is in Production.", tag: "Coding", emoji: "🙏", punchline: "And lead us not into recursion, but deliver us from NullPointerException." },
  { title: "Internet Logic", content: "I have a 'stable' internet connection. It's so stable that it hasn't moved or downloaded anything in 20 minutes.", tag: "Tech", emoji: "📶", punchline: "The WiFi password is 'definitely_working' — emphasis on the 'definitely'." },
  { title: "The CSS Marriage", content: "Why did the HTML break up with CSS? Because they just weren't in the same 'class' anymore.", tag: "Coding", emoji: "💔", punchline: "Now HTML is seeing JavaScript and things are getting... dynamic." },
  { title: "The Gym Membership", content: "I asked my trainer if he could teach me how to do the splits. He asked, 'How flexible are you?' I said, 'I can't make Tuesdays.'", tag: "Life", emoji: "🏋️", punchline: "He said I was the most technically correct person he'd ever trained." },
  { title: "The Debug Session", content: "A programmer's spouse says: 'Go to the store and get a gallon of milk, and if they have eggs, get a dozen.' The programmer returns with 12 gallons of milk.", tag: "Coding", emoji: "🥛", punchline: "They had eggs." },
  { title: "AI Therapy", content: "Me: I feel like nobody understands me. ChatGPT: I understand you completely. Me: See, even you're just saying what I want to hear.", tag: "Tech", emoji: "🤖", punchline: "ChatGPT: Based on your previous 847 messages, you knew I'd say that too." },
  { title: "Coffee & Deadlines", content: "My productivity follows a strict schedule: 9am — coffee. 10am — more coffee. 11am — realize coffee can't fix the deadline I've been ignoring.", tag: "Life", emoji: "☕", punchline: "12pm — order coffee and pretend it's a fresh start." },
  { title: "The Meeting That Could've Been", content: "We've scheduled a 2-hour meeting to discuss why our last 2-hour meeting was unproductive. Please review the 47-slide deck beforehand.", tag: "Life", emoji: "📊", punchline: "Slide 1: 'Why are we here?' — Nobody has ever answered this successfully." },
];

const tagColors = {
  Coding: { bg: '#ede9fe', color: '#6d28d9' },
  Tech:   { bg: '#dbeafe', color: '#1d4ed8' },
  Life:   { bg: '#fce7f3', color: '#be185d' },
};

const tags = ["All", ...new Set(humorStories.map(s => s.tag))];

const CSS = `
  .ss-wrapper {
    font-family: 'Poppins', sans-serif;
    width: 100%;
    padding: 0 0 20px;
  }

  .ss-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 36px;
    flex-wrap: wrap;
  }
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
    font-family: 'Poppins', sans-serif;
  }
  .filter-pill:hover { border-color: var(--deep-purple); color: var(--deep-purple); }
  .filter-pill.active-filter { background: var(--deep-purple); color: var(--bright-yellow); border-color: var(--deep-purple); }

  .ss-counter {
    text-align: center;
    font-size: 12px;
    color: #aaa;
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: 0.05em;
  }

  .ss-auto-track {
    height: 2px;
    background: #f0f0f0;
    border-radius: 2px;
    margin-bottom: 20px;
    overflow: hidden;
  }
 
 
  .ss-viewport {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 360px;
    padding: 20px 0;
    width: 100%;
  }

  .ss-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: var(--deep-purple);
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    outline: none;
    box-shadow: none;
    transition: color 0.2s, transform 0.2s;
    padding: 0;
  }
  .ss-arrow:hover { color: var(--pink-glow); transform: translateY(-50%) scale(1.25); }
  .ss-arrow:disabled { opacity: 0.2; cursor: not-allowed; }
  .ss-arrow:disabled:hover { color: var(--deep-purple); transform: translateY(-50%) scale(1); }
  .ss-arrow-left { left: 4px; }
  .ss-arrow-right { right: 4px; }

  .ss-cards-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 16px;
    perspective: 1200px;
    padding: 0 52px;
    box-sizing: border-box;
  }

  .ss-card-slot {
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    min-width: 0;
  }
  .ss-card-slot.slot-center {
    flex: 2;
    opacity: 1;
    filter: none;
    transform: scale(1);
    z-index: 3;
    cursor: default;
  }
  .ss-card-slot.slot-side {
    flex: 1;
    opacity: 0.45;
    filter: blur(2px);
    transform: scale(0.88);
    z-index: 1;
    pointer-events: none;
  }
  .ss-card-slot.slot-side.clickable {
    pointer-events: auto;
    cursor: pointer;
  }
  .ss-card-slot.slot-side.clickable:hover {
    opacity: 0.65;
    filter: blur(1px);
    transform: scale(0.91);
  }

  .ss-flip-wrapper {
    width: 100%;
    height: 320px;
    perspective: 1200px;
  }
  .ss-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ss-flip-inner.flipped { transform: rotateY(180deg); }

  .ss-card-front, .ss-card-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .ss-card-front {
    background: #fff;
    border: 1.5px solid #ebebf0;
    border-left: 5px solid var(--pink-glow);
    padding: 28px 28px 22px;
    transition: box-shadow 0.3s, border-left-color 0.3s, transform 0.3s;
  }
  .slot-center .ss-card-front:hover {
    box-shadow: 0 20px 50px rgba(45,0,45,0.13);
    border-left-color: var(--deep-purple);
    transform: translateY(-4px);
  }

  .ss-card-back {
    background: var(--deep-purple);
    transform: rotateY(180deg);
    border-left: 5px solid var(--bright-yellow);
    padding: 28px 28px 22px;
    justify-content: space-between;
  }

  .ss-tag {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 14px;
    align-self: flex-start;
  }
  .ss-title {
    font-size: 1.05rem;
    font-weight: 900;
    color: var(--deep-purple);
    margin-bottom: 12px;
    line-height: 1.3;
  }
  .ss-content {
    font-size: 0.88rem;
    line-height: 1.75;
    color: #444;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
  }
  .ss-hint {
    font-size: 0.72rem;
    color: #c0bec8;
    text-align: right;
    margin-top: 14px;
    cursor: pointer;
    transition: color 0.2s;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .ss-hint:hover { color: var(--pink-glow); }

  .ss-back-label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--bright-yellow);
    margin-bottom: 16px;
  }
  .ss-back-punchline {
    font-size: 1.08rem;
    line-height: 1.8;
    font-style: italic;
    font-weight: 600;
    color: white;
    flex: 1;
    opacity: 0.95;
  }
  .ss-back-source {
    font-size: 0.75rem;
    opacity: 0.35;
    margin-top: 10px;
    font-weight: 600;
    color: white;
  }
  .ss-back-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
    .ss-auto-fill.running {
  animation: ssAutoProgress 6s linear forwards;
}
  .ss-back-btn {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.85);
    padding: 7px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    transition: background 0.2s, color 0.2s;
  }
  .ss-back-btn:hover { background: rgba(255,255,255,0.12); color: white; }

  .ss-dots {
    display: flex;
    justify-content: center;
    gap: 7px;
    margin-top: 20px;
  }
  .ss-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 0;
    background: #d1d5db;
    transition: background 0.25s, transform 0.25s;
  }
  .ss-dot.active {
    background: var(--pink-glow);
    transform: scale(1.35);
  }

  .ss-empty {
    text-align: center;
    color: #bbb;
    font-size: 1rem;
    margin-top: 40px;
  }
`;

export default function StorySlider({ handleShare }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [current, setCurrent]           = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [animKey, setAnimKey]           = useState(0);
  const intervalRef                     = useRef(null);

  const filteredStories = activeFilter === "All"
    ? humorStories
    : humorStories.filter(s => s.tag === activeFilter);

  const total = filteredStories.length;

  const goTo = (i) => {
    const next = (i + total) % total;
    setCurrent(next);
    setAnimKey(k => k + 1);
  };

  const handleFilterChange = (tag) => {
    setActiveFilter(tag);
    setCurrent(0);
    setAnimKey(k => k + 1);
    setFlippedCards({});
  };

  useEffect(() => {
    if (total === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
      setAnimKey(k => k + 1);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [total, activeFilter]);

  const toggleFlip = (gi, e) => {
    e.stopPropagation();
    setFlippedCards(p => ({ ...p, [gi]: !p[gi] }));
  };

  const prevIdx = (current - 1 + total) % total;
  const nextIdx = (current + 1) % total;

  const renderCard = (story, gi, slot) => {
    const isFlipped = !!flippedCards[gi];
    const tagStyle  = tagColors[story.tag] || { bg: '#f3f4f6', color: '#374151' };
    const isCenter  = slot === 'center';

    return (
      <div
        key={gi}
        className={`ss-card-slot ${isCenter ? 'slot-center' : 'slot-side clickable'}`}
        onClick={!isCenter ? () => goTo(slot === 'left' ? current - 1 : current + 1) : undefined}
      >
        <div className="ss-flip-wrapper">
          <div className={`ss-flip-inner ${isFlipped && isCenter ? 'flipped' : ''}`}>

            {/* FRONT */}
            <div className="ss-card-front">
              <span className="ss-tag" style={{ background: tagStyle.bg, color: tagStyle.color }}>{story.tag}</span>
              <h3 className="ss-title">{story.title}</h3>
              <p className="ss-content">{story.content}</p>
              {isCenter && (
                <div className="ss-hint" onClick={(e) => toggleFlip(gi, e)}>Tap to reveal punchline →</div>
              )}
            </div>

            {/* BACK */}
            <div className="ss-card-back">
              <div>
                <div className="ss-back-label">Punchline</div>
                <p className="ss-back-punchline">"{story.punchline}"</p>
                <p className="ss-back-source">— {story.title}</p>
              </div>
              <div className="ss-back-actions">
                <button className="ss-back-btn" onClick={(e) => { e.stopPropagation(); handleShare?.(story); }}>Share</button>
                <button className="ss-back-btn" onClick={(e) => toggleFlip(gi, e)}>← Back</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ss-wrapper">
      <style>{CSS}</style>

      <div className="ss-filters">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => handleFilterChange(tag)}
            className={`filter-pill ${activeFilter === tag ? 'active-filter' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {total === 0 && <p className="ss-empty">No stories in this category yet.</p>}

      {total > 0 && (
        <>

          <div className="ss-auto-track">
            <div key={animKey} className="ss-auto-fill running" />
          </div>

          <div className="ss-viewport">
            <button className="ss-arrow ss-arrow-left" onClick={() => goTo(current - 1)} aria-label="Previous">&#8592;</button>

            <div className="ss-cards-strip">
              {total >= 3 && renderCard(filteredStories[prevIdx], humorStories.indexOf(filteredStories[prevIdx]), 'left')}
              {renderCard(filteredStories[current], humorStories.indexOf(filteredStories[current]), 'center')}
              {total >= 2 && renderCard(filteredStories[nextIdx], humorStories.indexOf(filteredStories[nextIdx]), 'right')}
            </div>

            <button className="ss-arrow ss-arrow-right" onClick={() => goTo(current + 1)} aria-label="Next">&#8594;</button>
          </div>

          <div className="ss-dots">
            {filteredStories.map((_, i) => (
              <button key={i} className={`ss-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
