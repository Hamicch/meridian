# Implementation Tracking

## Stages

### Stage 1 — Foundation
- [ ] Git init + .gitignore
- [ ] .env.example
- [ ] Makefile
- [ ] docker-compose.yml

### Stage 2 — Backend Core
- [ ] requirements.txt
- [ ] app/models.py
- [ ] app/observability.py
- [ ] app/mcp_client.py
- [ ] app/agent.py (OpenRouter + MCP loop)
- [ ] app/guardrails.py (LlamaGuard via Groq)
- [ ] app/main.py (FastAPI, /health, /api/chat)
- [ ] Dockerfile

### Stage 3 — Frontend Core
- [ ] Next.js init (app router, tailwind, typescript)
- [ ] lib/types.ts
- [ ] lib/api.ts
- [ ] components/typing-indicator.tsx
- [ ] components/message-bubble.tsx
- [ ] components/chat-interface.tsx
- [ ] app/api/chat/route.ts (proxy)
- [ ] app/page.tsx
- [ ] app/layout.tsx

### Stage 4 — Tests
- [ ] tests/test_mcp.py
- [ ] tests/test_agent.py
- [ ] tests/test_guardrails.py
- [ ] Run: all 4 pass

### Stage 5 — Evals
- [ ] evals/golden_dataset.json
- [ ] evals/run_evals.py
- [ ] Run: ≥ 4/5 pass

### Stage 6 — CI + Deploy
- [ ] .github/workflows/ci.yml
- [ ] Deploy backend → Railway
- [ ] Deploy frontend → Vercel
- [ ] Smoke test live URLs

## Notes
<!-- Add blockers, decisions, surprises here as you go -->
