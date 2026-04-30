from dotenv import load_dotenv
load_dotenv()

from .observability import init as init_observability
init_observability()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models.chat import ChatRequest, ChatResponse
from .services.chat import handle_chat
from .tools.mcp_client import get_tools

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/tools")
async def tools():
    return await get_tools()


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = await handle_chat(request.messages)
    return ChatResponse(reply=reply)
