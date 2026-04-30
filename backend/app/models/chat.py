from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    messages: list[Message] = []


class ChatResponse(BaseModel):
    reply: str
    blocked: bool = False
