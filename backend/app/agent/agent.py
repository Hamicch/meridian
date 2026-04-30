import json
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from ..llm.client import client
from ..tools.mcp_client import format_for_openai
from ..models.chat import Message
from ..configs.settings import MCP_SERVER_URL, OPENAI_MODEL

SYSTEM_PROMPT = (
    "You are Meridian Electronics' customer support assistant. "
    "Help customers with: product availability, order status, placing orders, account authentication. "
    "Use the available tools. Be concise and professional. "
    "Decline anything outside these areas."
)


async def run_agent(messages: list[Message]) -> str:
    async with streamablehttp_client(MCP_SERVER_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()

            tools = format_for_openai([
                {
                    "name": t.name,
                    "description": t.description or "",
                    "parameters": t.inputSchema,
                }
                for t in tools_result.tools
            ])

            thread = [{"role": "system", "content": SYSTEM_PROMPT}]
            thread += [{"role": m.role, "content": m.content} for m in messages]

            while True:
                response = await client.chat.completions.create(
                    model=OPENAI_MODEL,
                    messages=thread,
                    tools=tools,
                )
                choice = response.choices[0]

                if choice.finish_reason != "tool_calls":
                    return choice.message.content or ""

                thread.append(choice.message)

                for tc in choice.message.tool_calls:
                    result = await session.call_tool(
                        tc.function.name,
                        json.loads(tc.function.arguments),
                    )
                    thread.append({
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": json.dumps([c.model_dump() for c in result.content]),
                    })
