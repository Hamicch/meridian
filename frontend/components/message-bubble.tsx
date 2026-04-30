import type { Message } from "@/lib/types";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <div className="max-w-2xl rounded-full border border-amber-300/80 bg-amber-100/90 px-4 py-2 text-center text-sm font-medium text-amber-950 shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-[1.75rem] px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[75%] ${
          isUser
            ? "bg-slate-950 text-white"
            : "border border-white/80 bg-white/90 text-slate-900"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
