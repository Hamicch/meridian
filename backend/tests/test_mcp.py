import pytest
from app.tools.mcp_client import get_tools


@pytest.mark.asyncio
async def test_mcp_returns_tools():
    tools = await get_tools()
    assert len(tools) > 0
    assert all("name" in t for t in tools)
