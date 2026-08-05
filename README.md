# VentureIQ — AI Co-founder skeleton

A working full-stack skeleton for VentureIQ: sign up, create a company, chat with
an "AI co-founder," upload data for a dashboard, run market research, and see
growth suggestions. Responsive — works on desktop and mobile browsers.

This is a **skeleton**: auth, database, routing, and UI are fully wired and
working end to end. The three AI-powered features (chat, market analysis,
growth suggestions) currently return clearly-labeled stub responses — every
"plug point" in the backend code is commented with exactly where to add the
real Claude API call.

## Project structure

```
ventureiq/
  backend/           FastAPI + SQLite
    main.py          App entrypoint
    models.py         Database tables (User, Company, Document, ChatMessage, Dataset)
    auth.py            JWT auth + password hashing
    schemas.py          Request/response shapes
    routers/           One file per feature area
  frontend/           React + Vite + Tailwind
    src/pages/         One file per screen
    src/components/    Shared UI (nav shell, logo)
    src/lib/            API client + auth context
```

## Running it locally

**Backend** (needs Python 3.10+):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (needs Node 18+), in a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The frontend
proxies `/api` calls to the backend automatically (see `vite.config.js`), so
both need to be running.

## What's already working

- Sign up / log in (JWT-based)
- Create and switch between multiple companies per user
- Upload text documents into a per-company "knowledge base"
- Chat UI with message history, wired to the backend
- Upload a CSV and see it auto-charted (line + bar) plus a raw data table
- Market research screen with a "Run analysis" flow
- Growth suggestions screen
- Fully responsive: sidebar nav on desktop, bottom tab bar on mobile

## Wiring in the real AI (next step)

Look for `# --- Plug point ---` comments in:
- `backend/routers/chat_router.py` — swap the stub reply for a Claude API call.
  Pass in the company profile + retrieved document chunks + the user's message.
- `backend/routers/market_router.py` — combine a web search API with a Claude
  call to synthesize competitor/trend data into the same response shape.
- `backend/routers/growth_router.py` — same idea: feed company profile +
  latest dataset summary + market analysis into a Claude call for grounded,
  prioritized suggestions.

For the knowledge base to feel like it "knows the company," the natural next
step is: chunk `Document.content_text`, embed the chunks, store them in a
vector DB (Chroma is the easiest to start with), and retrieve the top
matches for each chat message before calling the LLM. That's the "RAG" part
of the architecture — right now documents are stored but not yet embedded.

## Known simplifications (fine for a demo, flag in your report)

- SQLite instead of Postgres — swap `DATABASE_URL` in `database.py` when you're ready.
- Datasets are stored as JSON blobs directly in the database (fine for small
  demo CSVs; a real version would use a proper data warehouse table or object storage).
- No file-type validation beyond CSV/plaintext yet — add PDF/DOCX parsing for
  richer document uploads.
- CORS is wide open (`allow_origins=["*"]`) — tighten this before any real deployment.
