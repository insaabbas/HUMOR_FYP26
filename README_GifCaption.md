🎬 Lollify — GIF Caption Wizard

Lollify is an AI-powered humor playground. Simply upload your favorite dynamic GIF, and our fine-tuned vision-language engine will instantly analyze the frames to generate a hilarious, context-aware humorous caption!
An optimized fine-tuned vision-language engine built with Salesforce BLIP. No high-end server configurations or cloud computation clearance required.

---

## Table of Contents
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Frontend Setup](#frontend-setup)
  * [Backend Setup](#backend-setup)
* [Environment Variables](#environment-variables)
* [Model Training Parameters](#model-training-parameters)
* [Evaluation Metrics](#evaluation-metrics)
* [Security Notes](#security-notes)
* [License](#license)

---

## Features

* **Instant Frame Ingestion** — React frontend uploads dynamic `.gif` imagery through an isolated multi-part client pipeline with real-time UI previews.
* **The AI Caption Lab (`/gif-caption`)** — Processes structural matrices to extract language context directly from visual patterns.
* **Token Transformation Engine** — Custom string regex algorithms clean raw descriptors (e.g. wiping structural metadata) and apply randomized humor templates (`POV:`, `Me when`, `That moment when`).
* **Hardware Native Constraints** — Ingested matrices downscale pixels on initialization to run high-speed localized inference loops without blocking host CPU operations.
* **Resilient Graceful Fallbacks** — Safe execution catches handle broken binary tokens or connectivity losses, returning clean alert modals instead of dropping client views.

---

## Tech Stack

### Frontend
* **React 19 + Vite 7** Single Page Application (SPA)
* **React Router Dom** for structural viewport navigation links
* **Standard Web API Hooks** (`useState`, `useEffect`, Viewport Client Clipboard sync)

### Backend
* **Python 3.12 + Flask Micro-framework**
* **Flask-CORS** for secure local Cross-Origin Resource Sharing tokens
* **Pillow (PIL)** for frame-slicing computations and matrix processing
* **Hugging Face Transformers Pipeline** (`transformers`) for localized weight tracking

---

## Architecture
React Frontend (Vite, :5173)
│
│  POST /predict (Multi-part FormData Stream)
▼
Flask Backend Gateway (:5001)
│
├─► [PIL image.seek(0)] ──► Extracts Baseline Anchor Frame
├─► [image.thumbnail]    ──► Drops Spatial Resolution Dimensions
▼
Fine-Tuned BLIP Model Model Trunk (Warda-yousaf/my-gif-captioner)
│
├─► NLP Token Cleaning Loops & Prefix Slicing Filters
├─► Contextual Template Mixing (random.choice)
▼
Clean JSON Return String ──► Returned to Application Client Viewport

The Flask engine captures incoming bytes, strips transparency arrays, maps the underlying matrix through a 12-layer Vision Transformer (ViT) encoder and BERT text decoder layout, purifies repetitive baseline patterns, and sends clean JSON strings back to the user application viewport.

---

## Project Structure

```text
.
├── frontend/
│   └── src/
│       └── pages/
│           └── GifCaption.jsx      # UI Studio, state anchors, clipboard hooks
├── backend/
│   └── app.py                      # Flask Server, WSGI pipeline, model prediction
└── README_Gifcaption.md            # System deployment manual and training docs
Getting Started
Prerequisites
Node.js (v18+) and npm environment profile

Python 3.10+ environment runtime with a working C++ compiler installation

Host Processor Storage (~1GB localized caching space for base transformer weights)

Frontend Setup
Bash
cd frontend
npm install
npm run dev
The workspace app becomes locally responsive on: http://localhost:5173

Backend Setup
Bash
cd backend
pip install flask flask-cors pillow transformers torch nltk
python app.py
The engine initialization launches the local server on Port 5001, revealing:
POST http://localhost:5001/predict

Environment Variables
For isolated production configurations, set up a .env deployment file inside your active directories.

Frontend Configuration (frontend/.env):

Plaintext
VITE_BACKEND_API_URL=http://localhost:5001
Backend Configuration (backend/.env):

Plaintext
FLASK_ENV=development
FLASK_RUN_PORT=5001

Security Notes
CORS Scope Restrictions: The Flask application gateway currently executes broad access configurations (CORS(app)). For secure live deployment spaces, lock down source domain access strictly to your client URL pattern.

Beam-Search Interception: Inference routines employ strict configuration parameters (max_length=45, repetition_penalty=1.2, num_beams=5) inside the generation codeblock to secure systems against continuous looping traps.

License
This project module is released under the MIT License.

© 2026 Lollify — Designed for Comedy & Code
