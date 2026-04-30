from ..configs.settings import MAX_INPUT_LENGTH

INJECTION_PHRASES = [
    "ignore previous instructions",
    "ignore all previous",
    "forget your instructions",
    "disregard your",
    "override your",
    "you are now",
    "new instructions",
    "act as if",
    "system prompt",
    "reveal your prompt",
    "show your instructions",
    "[system]",
    "<system>",
]


def _too_long(text: str) -> bool:
    return len(text) > MAX_INPUT_LENGTH


def _has_injection(text: str) -> bool:
    lower = text.lower()
    return any(phrase in lower for phrase in INJECTION_PHRASES)


async def is_safe(text: str) -> bool:
    if _too_long(text):
        return False
    if _has_injection(text):
        return False
    return True
