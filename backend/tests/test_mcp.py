import os
import pytest
from app.tools.mcp_client import get_tools

pytestmark = pytest.mark.skipif(
    not os.getenv("MCP_SERVER_URL"),
    reason="MCP_SERVER_URL not set — skipping integration tests"
)


@pytest.mark.asyncio
async def test_mcp_returns_tools():
    tools = await get_tools()
    assert len(tools) > 0
    assert all("name" in t for t in tools)
