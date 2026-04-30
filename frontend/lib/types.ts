export type ChatRole = "user" | "assistant";
export type MessageRole = ChatRole | "system";

export interface Message {
  role: MessageRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  messages: {
    role: ChatRole;
    content: string;
  }[];
}

export interface ChatResponse {
  reply: string;
  blocked: boolean;
}
