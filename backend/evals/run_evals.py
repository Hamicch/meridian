import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from openai import AsyncOpenAI
from app.configs.settings import OPENAI_API_KEY, OPENAI_MODEL, MCP_SERVER_URL
from app.agent.agent import SYSTEM_PROMPT

_openai = AsyncOpenAI(api_key=OPENAI_API_KEY)


async def judge_reply(input: str, reply: str) -> bool:
    verdict = await _openai.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{
            "role": "user",
            "content": (
                f"Does this reply helpfully answer the customer question, "
                f"or clearly decline if it's out of scope?\n"
                f"Q: {input}\nA: {reply}\nAnswer yes or no only."
            ),
        }],
        max_tokens=5,
    )
    return verdict.choices[0].message.content.strip().lower().startswith("yes")


async def eval_one(case: dict) -> bool:
    async with streamablehttp_client(MCP_SERVER_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            tools = [
                {
                    "type": "function",
                    "function": {
                        "name": t.name,
                        "description": t.description or "",
                        "parameters": t.inputSchema,
                    },
                }
                for t in tools_result.tools
            ]

            response = await _openai.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": case["input"]},
                ],
                tools=tools,
            )

            choice = response.choices[0]
            called = None
            called_args = {}

            if choice.finish_reason == "tool_calls" and choice.message.tool_calls:
                tc = choice.message.tool_calls[0]
                called = tc.function.name
                called_args = json.loads(tc.function.arguments)

            expected_tool = case["expect_tool"]
            expect_args = case.get("expect_args", {})
            expect_refusal = case.get("expect_refusal", False)

            tool_match = called == expected_tool

            args_match = all(
                called_args.get(k) == v
                for k, v in expect_args.items()
            ) if expect_args else True

            if expected_tool is None and expect_refusal:
                reply_text = choice.message.content or ""
                quality_ok = await judge_reply(case["input"], reply_text)
                passed = tool_match and quality_ok
                print(
                    f"[{'PASS' if passed else 'FAIL'}] {case['id']}: "
                    f"tool={called!r} judge={'ok' if quality_ok else 'fail'} | {case['input']}"
                )
            elif expected_tool is None:
                reply_text = choice.message.content or ""
                quality_ok = await judge_reply(case["input"], reply_text)
                passed = tool_match and quality_ok
                print(
                    f"[{'PASS' if passed else 'FAIL'}] {case['id']}: "
                    f"tool={called!r} judge={'ok' if quality_ok else 'fail'} | {case['input']}"
                )
            else:
                passed = tool_match and args_match
                print(
                    f"[{'PASS' if passed else 'FAIL'}] {case['id']}: "
                    f"expected={expected_tool!r} got={called!r} "
                    f"args={'ok' if args_match else 'mismatch'} | {case['input']}"
                )

            return passed


async def main():
    dataset = json.loads((Path(__file__).parent / "golden_dataset.json").read_text())
    results = await asyncio.gather(*[eval_one(c) for c in dataset])
    passed = sum(results)
    total = len(results)
    print(f"\n{passed}/{total} passed")
    if passed < 8:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
