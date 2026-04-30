import os
import pytest
from app.agent.agent import run_agent
from app.models.chat import Message

pytestmark = pytest.mark.skipif(
    not os.getenv("MCP_SERVER_URL"),
    reason="MCP_SERVER_URL not set — skipping integration tests"
)


def msg(content: str) -> list[Message]:
    return [Message(role="user", content=content)]


@pytest.mark.asyncio
async def test_list_products():
    reply = await run_agent(msg("Show me all monitors you have available"))
    assert isinstance(reply, str) and len(reply) > 0


@pytest.mark.asyncio
async def test_get_product():
    reply = await run_agent(msg("Give me details for product SKU MON-0001"))
    assert isinstance(reply, str) and len(reply) > 0


@pytest.mark.asyncio
async def test_search_products():
    reply = await run_agent(msg("Search for keyboards"))
    assert isinstance(reply, str) and len(reply) > 0


@pytest.mark.asyncio
async def test_get_customer():
    reply = await run_agent(msg("Look up customer with ID c-1234"))
    assert isinstance(reply, str) and len(reply) > 0


@pytest.mark.asyncio
async def test_verify_customer_pin():
    reply = await run_agent(msg("Verify my account, my email is jane@example.com and my PIN is 1234"))
    assert isinstance(reply, str) and len(reply) > 0


@pytest.mark.asyncio
async def test_list_orders():
    reply = await run_agent(msg("Show me all submitted orders"))
    assert isinstance(reply, str) and len(reply) > 0


@pytest.mark.asyncio
async def test_get_order():
    reply = await run_agent(msg("Get details for order ID ord-9982"))
    assert isinstance(reply, str) and len(reply) > 0


@pytest.mark.asyncio
async def test_create_order():
    reply = await run_agent(msg("Place an order for customer c-1234, 1 unit of MON-0001 at $299 USD"))
    assert isinstance(reply, str) and len(reply) > 0
