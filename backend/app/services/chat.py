from ..agent.agent import run_agent
from ..models.chat import Message
from ..guardrails.guard import is_safe


async def handle_chat(messages: list[Message]) -> str:
    last = messages[-1].content if messages else ""

    if not await is_safe(last):
        return "I'm sorry, I can't help with that. Please ask me about Meridian products or orders."

    return await run_agent(messages)
