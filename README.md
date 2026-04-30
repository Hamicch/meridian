# Meridian Electronics — Customer Support Chatbot

AI-powered customer support chatbot for Meridian Electronics. Handles product availability, order lookup, order placement, and customer authentication via an MCP-connected agent.

**Live demo:** https://meridian-ten-gamma.vercel.app

## Stack

- **Frontend:** Next.js App Router, Tailwind CSS — deployed on Vercel
- **Backend:** Python FastAPI — deployed on Railway
- **LLM:** OpenAI GPT-4o-mini via agent loop
- **Tools:** MCP server (Streamable HTTP) exposing 8 Meridian business tools
- **Observability:** LangTrace
- **Guardrails:** Prompt injection + length checks

## Project Structure

```
meridian/
├── frontend/    # Next.js chat UI
└── backend/     # FastAPI agent + MCP client
```

## Local Development

### Backend

```bash
cd backend
uv venv --python 3.12
source .venv/bin/activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local  # set BACKEND_URL=http://localhost:8000
npm run dev
```

Open http://localhost:3000

## Environment Variables

### Backend
```
OPENAI_API_KEY=
MCP_SERVER_URL=https://order-mcp-74afyau24q-uc.a.run.app/mcp
LANGTRACE_API_KEY=
```

### Frontend
```
BACKEND_URL=https://your-backend.railway.app
```

## Tests

```bash
cd backend
pytest tests/ -v
```

## Evals

```bash
cd backend
python evals/run_evals.py
```

Pass threshold: 8/10
