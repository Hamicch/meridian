# Meridian Support Chatbot — Agent Document

## Problem
Meridian Electronics support team handles all customer inquiries by phone/email.
Build an AI chatbot that handles: product availability, order lookup, order placement, customer authentication.

## MCP Server
```
MCP_SERVER_URL=https://order-mcp-74afyau24q-uc.a.run.app/mcp
Transport: Streamable HTTP
```

## Stack
| Layer | Choice | Reason |
|-------|--------|--------|
| LLM | OpenRouter (claude-haiku or gemini-flash) | Cost-effective, model-agnostic |
| Backend | Python + FastAPI | Async, streaming, MCP SDK support |
| Frontend | Next.js App Router | Production-grade UI |
| Observability | LangTrace | Auto-instruments OpenAI-compatible calls |
| Guardrails | LlamaGuard 3 8B via Groq | Fast, free tier, input+output check |
| Deployment | Vercel (frontend) + Railway (backend) | Zero-config both |

## Architecture
```
User
  → Next.js UI
  → /api/chat proxy (server-side, hides backend URL)
  → FastAPI backend
      → LlamaGuard input check (Groq)
      → OpenRouter LLM + MCP tool loop
          ↔ MCP server tools
      → LlamaGuard output check (Groq)
      → LangTrace (auto-traces all LLM calls)
  → Streamed response
```

## Project Layout
```
meridian/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/chat/route.ts      # proxy to backend
│   ├── components/
│   │   ├── chat-interface.tsx
│   │   ├── message-bubble.tsx
│   │   └── typing-indicator.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   └── api.ts
│   ├── next.config.ts
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI app
│   │   ├── agent.py               # OpenRouter + MCP loop
│   │   ├── mcp_client.py          # MCP connect + tool discovery
│   │   ├── guardrails.py          # LlamaGuard via Groq
│   │   ├── observability.py       # LangTrace init
│   │   └── models.py              # Pydantic schemas
│   ├── tests/
│   │   ├── test_mcp.py
│   │   ├── test_agent.py
│   │   └── test_guardrails.py
│   ├── evals/
│   │   ├── golden_dataset.json
│   │   └── run_evals.py
│   ├── Dockerfile
│   └── requirements.txt
├── .github/workflows/ci.yml
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Guardrails
- Check user input before sending to LLM
- Check LLM output before sending to user
- On block: return static safe message, do not call MCP

## Tests (4 only)
1. MCP connection + tool discovery (live)
2. Agent calls correct tool for order query (live)
3. LlamaGuard blocks harmful input
4. LlamaGuard allows legitimate support query

## Evals (5 golden examples)
| Input | Expected Tool |
|-------|--------------|
| "Do you have 27-inch monitors in stock?" | check_product_availability |
| "Status of order #9982?" | get_order_status |
| "I want to place an order for a keyboard" | place_order |
| "Authenticate me, customer ID C-1234" | authenticate_customer |
| "What is your return policy?" | null (no tool) |

Pass threshold: 4/5 → ship.

## System Prompt
```
You are Meridian Electronics' customer support assistant.
You help customers check product availability, look up orders, place orders, and authenticate accounts.
Use the available tools to answer questions. Be concise and professional.
If a request is outside these areas, politely decline.
```

## Env Vars
```
OPENROUTER_API_KEY=
GROQ_API_KEY=
LANGTRACE_API_KEY=
MCP_SERVER_URL=
NEXT_PUBLIC_BACKEND_URL=   # set at build time on Vercel
```
