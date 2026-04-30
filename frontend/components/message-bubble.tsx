import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type { Message } from "@/lib/types";

const assistantMarkdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-teal-700 underline decoration-teal-700/30 underline-offset-2 hover:text-teal-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-2 list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal pl-5">{children}</ol>,
  li: ({ children }) => <li className="my-0.5 pl-0.5">{children}</li>,
  h1: ({ children }) => (
    <h1 className="mb-1 mt-3 text-base font-semibold text-slate-950 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-1 mt-3 text-base font-semibold text-slate-950 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-3 text-sm font-semibold text-slate-950 first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1 mt-3 text-sm font-semibold text-slate-950 first:mt-0">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="mb-1 mt-3 text-sm font-semibold text-slate-950 first:mt-0">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="mb-1 mt-3 text-sm font-semibold text-slate-950 first:mt-0">{children}</h6>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-4 border-slate-200 pl-3 text-slate-600 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-0 border-t border-slate-200" />,
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-xl bg-slate-900 p-3 text-[0.8125rem] leading-relaxed text-slate-100 shadow-inner">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-48 border-collapse text-left text-[0.8125rem]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-50 text-slate-800">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-slate-200 px-2 py-1.5 font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-t border-slate-200 px-2 py-1.5">{children}</td>,
};

function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="assistant-md">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={assistantMarkdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

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
        className={`max-w-[85%] rounded-[1.75rem] px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[75%] ${
          isUser
            ? "whitespace-pre-wrap bg-slate-950 text-white"
            : "border border-white/80 bg-white/90 text-slate-900 [&_.task-list-item]:list-none [&_input]:mr-2"
        }`}
      >
        {isUser ? message.content : <AssistantMarkdown content={message.content} />}
      </div>
    </div>
  );
}
