# 😂 Lollify — The Humor Vault

Lollify is an AI-powered humor playground. Get a daily joke, smash two random words together to see what happens, turn a news headline into a punchline, and (soon) caption a GIF — all wrapped in an over-the-top animated UI that doesn't take itself seriously.

> A highly classified stash of jokes, stories, and AI-powered punchlines. No dad-joke clearance required.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [Pages](#pages)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Joke of the Day** — homepage hero pulls an AI-generated joke on load, with a "Hit me again 🎉" refresh button and emoji reactions (😂 / 😐 / 🙄)
- **Comedy Lab** (`/text-humor`)
  - **Word Alchemy** — feed in two random words, get a joke that forces them into an unlikely friendship
  - **News Headline** — paste a headline, get back a satirical punchline
- **GIF Caption** & **GIF Prompt** pages — additional humor generators (see `/gif-caption` and `/gif-prompt`)
- **Newsletter signup + contact form** — delivered via [Web3Forms](https://web3forms.com), no backend required for these two
- **Local fallback jokes** — if the AI backend is unreachable, the app gracefully falls back to a small local joke list instead of breaking
- A genuinely unreasonable amount of confetti, floating emojis, a "pull rope" easter egg, and walking animal critters, because comedy websites should have a sense of humor about themselves

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- [React Router 7](https://reactrouter.com/) for client-side routing
- [react-icons](https://react-icons.github.io/react-icons/)
- [Supabase JS](https://supabase.com/docs/reference/javascript) client (data/storage)
- [Google Generative AI SDK](https://ai.google.dev/) (`@google/generative-ai`)

**Backend**
- [Express](https://expressjs.com/) + `cors` + `dotenv`
- Proxies joke-generation requests to a model hosted on **Google Colab**

> Supabase and the Google Generative AI SDK are included as frontend dependencies but aren't exercised in the snippets shown here — they likely power the GIF Caption / GIF Prompt features. Adjust this section if their role differs in your actual codebase.

## Architecture

```
React frontend (Vite, :5173)
        │  POST /api/generate-joke  { prompt }
        ▼
Express backend (:5000)
        │  POST {COLAB_API_URL}/generate  { prompt }
        ▼
Model server running in Google Colab
```

The backend strips the model's raw output (e.g. trimming everything before `### Response:`), tags the response with a rough category (`joke of the day`, `Word pairs`, `headline`) based on keywords in the prompt, and returns clean JSON to the frontend.

## Project Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page, daily joke, about, contact
│   │   │   └── TextHumor.jsx     # Comedy Lab: Word Alchemy + Headline generator
│   │   ├── components/
│   │   │   └── StorySlider.jsx
│   │   └── assets/                # hero videos, character images, emojis
│   └── package.json
└── backend/
    ├── server.js                  # Express API, proxies to Colab model
    └── package.json
```

> Adjust paths above to match your actual repo layout if it differs — this is inferred from the files provided.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended) and npm
- A running model endpoint reachable at `COLAB_API_URL` (e.g. a Colab notebook exposing a `/generate` route via ngrok or similar)
- A free [Web3Forms](https://web3forms.com) access key, for the contact form and newsletter signup

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

Other available scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # run ESLint
```

### Backend Setup

```bash
cd backend
npm install
node server.js   # or `npm start`, depending on your package.json scripts
```

The API will be available at `http://localhost:5000`, exposing:

```
POST /api/generate-joke
Content-Type: application/json

{ "prompt": "Create a joke using the words \"toaster\" and \"existential dread\"." }
```

## Environment Variables

Create a `.env` file in `backend/`:

```env
COLAB_API_URL=https://your-colab-tunnel-url.ngrok-free.app
```

If your frontend uses Supabase and/or the Google Generative AI SDK directly, you'll also want a `frontend/.env`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-google-generative-ai-key
```

> Variable names above follow Vite's `VITE_` prefix convention — rename to match whatever your actual client code reads.

## Pages

| Route | Description |
|---|---|
| `/` | Home — daily joke, about section, contact form |
| `/text-humor` | Comedy Lab — Word Alchemy & News Headline generators |
| `/gif-caption` | GIF captioning generator |
| `/gif-prompt` | GIF prompt-based generator |

## Security Notes

- The Web3Forms access key is currently hardcoded directly in the frontend source (`TextHumor.jsx`, `Home.jsx`). Web3Forms keys are designed to be public-safe, but it's still good practice to move it into an environment variable (e.g. `VITE_WEB3FORMS_KEY`) rather than committing it inline.
- The backend currently enables CORS for all origins (`app.use(cors())`). Before deploying publicly, consider restricting this to your actual frontend domain.

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request

## License

Specify your license here (e.g. MIT) — none was provided in the source files.

---

© 2026 Lollify — Designed for Comedy & Code