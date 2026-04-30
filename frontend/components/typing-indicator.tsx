export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-2 rounded-[1.75rem] border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-teal-700/80" />
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-teal-700/80" />
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-teal-700/80" />
      </div>
    </div>
  );
}
