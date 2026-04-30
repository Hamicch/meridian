# Meridian Electronics — Customer Support Chatbot

AI-powered customer support chatbot for Meridian Electronics. Handles product availability, order lookup, order placement, and customer authentication via an MCP-connected agent.

**Live demo:** https://meridian-ten-gamma.vercel.app

## Architectural Decision Summary

### Recommendation

My recommendation is to move this prototype forward to a limited pilot, not a full production launch.

I think the architecture is sound because the chatbot is grounded in Meridian tools instead of relying on the model to invent operational answers. That makes it credible for real support workflows. The main gaps left are in hardening, safety depth, and operational readiness.

### Core Decision

The main decision I made was to use a tool-grounded agent architecture:

- Next.js frontend for the chat experience
- Next.js server route as a proxy so the backend URL stays private
- FastAPI backend for orchestration
- OpenAI `gpt-4o-mini` for reasoning and tool selection
- MCP tools as the source of truth for products, customers, and orders

This is the most important design choice in the project. In a customer support setting, I care more about operational accuracy than fluent text. I want the model to decide what action to take, but I want the business data to come from tools.

### Why `gpt-4o-mini`

I chose `gpt-4o-mini` because it is a practical fit for this prototype:

- Fast enough for chat
- Lower cost than a larger model
- Supports tool calling
- Strong enough for a narrow support domain

The tradeoff is that it will be less reliable on ambiguous or multi-step requests than a stronger model. At this stage, I think that tradeoff is acceptable because tool grounding matters more than raw model sophistication.

### What Works Well

- I have a clean separation between the frontend, backend, and tool layers
- The responses are grounded in Meridian operations instead of freeform LLM answers
- CI, integration tests, and evals give me a reasonable prototype baseline
- LangTrace and tool-level spans give me visibility into behavior and latency

### Current Limitations

- I have not added authentication or authorization yet
- The guardrails are still simple string-based checks
- CORS is still open
- MCP tool schemas are fetched on every request, which adds latency
- Reliability still depends on both the model provider and the MCP server
- Guardrail refusals are not yet surfaced end-to-end as structured `blocked=true` responses

### What I Would Improve Next

- Return structured blocked responses
- Add auth and stronger access control
- Cache tool metadata
- Expand eval coverage and adversarial testing
- Add retries, timeouts, and better failure handling
- Add conversation persistence and human escalation paths

### Final Assessment

My overall view is that this prototype proves the right architectural direction. The strongest decision here was using the LLM as a tool-calling orchestrator rather than a source of truth.

I would move it forward because the foundation is credible. I would not describe it as production-ready yet because the current safety, reliability, and access-control layers are still prototype-grade.

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
