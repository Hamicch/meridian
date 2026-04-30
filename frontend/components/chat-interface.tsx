"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { MessageBubble } from "@/components/message-bubble";
import { TypingIndicator } from "@/components/typing-indicator";
import type { ChatRequest, ChatResponse, ChatRole, Message } from "@/lib/types";

function toChatHistory(messages: Message[]): ChatRequest["messages"] {
  return messages
    .filter((message): message is { role: ChatRole; content: string } => {
      return message.role === "user" || message.role === "assistant";
    })
    .map(({ role, content }) => ({ role, content }));
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage() {
    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    const nextMessage: Message = { role: "user", content: message };
    const nextMessages = [...messages, nextMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const payload: ChatRequest = {
        message,
        messages: toChatHistory(nextMessages),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ChatResponse | { error?: string };

      if (!response.ok || !("reply" in data)) {
        throw new Error(
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: data.blocked ? "system" : "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "system",
          content:
            error instanceof Error ? error.message : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1 pb-4">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-64 items-center justify-center">
            <div className="max-w-md text-center">
              <p className="text-lg font-semibold text-slate-950">Ask Meridian anything support-related.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Get help with orders, billing, account access, and product questions.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={`${message.role}-${index}`} message={message} />
          ))
        )}
        {isLoading ? <TypingIndicator /> : null}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-[1.75rem] border border-white/70 bg-white/85 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur"
      >
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can Meridian help?"
            disabled={isLoading}
            rows={1}
            className="min-h-14 flex-1 resize-none border-0 bg-transparent px-2 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-500"
          />
          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            className="inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
