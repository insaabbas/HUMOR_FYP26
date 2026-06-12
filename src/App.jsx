import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import TextHumor from './pages/TextHumor';
import GifPrompt from './pages/GifPrompt'; // ✅ IMPORTANT LINE
import GifCaption from './pages/GifCaption';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text-humor" element={<TextHumor />} />
          <Route path="/gif-prompt" element={<GifPrompt />} /> {/* ✅ NEW ROUTE */}
          <Route path="/gif-caption" element={<GifCaption />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;