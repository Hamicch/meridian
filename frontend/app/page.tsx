import { ChatInterface } from "@/components/chat-interface";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <section className="flex w-full flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <div className="border-b border-slate-200/70 px-5 py-5 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">Meridian</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Customer support chat
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Reach Meridian support for account questions, billing issues, product guidance, and order help.
          </p>
        </div>
        <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          <ChatInterface />
        </div>
      </section>
    </main>
  );
}
