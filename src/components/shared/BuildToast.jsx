// BuildToast.jsx — Micro-reward toast shown when a module is installed.
// Brief, system-voiced, and self-dismissing — feedback, not decoration.

"use client";

export default function BuildToast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed top-4 inset-x-0 z-[60] flex justify-center px-6 pointer-events-none"
    >
      <div className="animate-pop bg-ink-800 border border-accent/40 rounded-xl px-4 py-2.5 shadow-lg">
        <p className="sys text-[11px] text-accent">▲ {message}</p>
      </div>
    </div>
  );
}
