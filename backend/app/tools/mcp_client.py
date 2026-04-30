from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from ..configs.settings import MCP_SERVER_URL


async def get_tools() -> list[dict]:
    async with streamablehttp_client(MCP_SERVER_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.list_tools()
            return [
                {
                    "name": t.name,
                    "description": t.description or "",
                    "parameters": t.inputSchema,
                }
                for t in result.tools
            ]


def format_for_openai(tools: list[dict]) -> list[dict]:
    return [
        {
            "type": "function",
            "function": {
                "name": t["name"],
                "description": t["description"],
                "parameters": t["parameters"],
            },
        }
        for t in tools
    ]
