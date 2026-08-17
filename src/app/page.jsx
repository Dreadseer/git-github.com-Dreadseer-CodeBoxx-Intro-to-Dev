// page.jsx — Entry screen. The first thing a student sees after scanning the QR code.
// One job: set the tone and get them into the build within seconds.
// Easter egg: tapping the wordmark five times unlocks the Midnight theme.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SECRET_UNLOCK_FLAG } from "@/data/themes";
import BuildToast from "@/components/shared/BuildToast";

export default function EntryPage() {
  const [taps, setTaps] = useState(0);
  const [toast, setToast] = useState("");

  // Five taps on the wordmark unlocks the hidden Midnight theme for this visit
  function handleWordmarkTap() {
    const next = taps + 1;
    setTaps(next);
    if (next === 5) {
      try {
        sessionStorage.setItem(SECRET_UNLOCK_FLAG, "1");
      } catch {
        // Storage unavailable — no unlock, no harm
      }
      setToast("SECRET UNLOCKED — MIDNIGHT THEME");
    }
  }

  // Auto-dismiss the unlock toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <main className="min-h-dvh lab-grid flex flex-col px-6 pt-14 pb-8 max-w-md mx-auto">
      <BuildToast message={toast} />

      {/* Wordmark — also the easter egg trigger */}
      <button
        onClick={handleWordmarkTap}
        className="flex items-center gap-2.5 mb-14 w-fit"
        aria-label="CodeBoxx Build Lab"
      >
        <span className="w-3.5 h-3.5 bg-accent rounded-sm" aria-hidden="true" />
        <span className="sys text-xs text-fg">
          CODEBOXX <span className="text-fg-dim">// BUILD LAB</span>
        </span>
      </button>

      {/* System boot line */}
      <p className="sys text-[11px] text-accent mb-4 animate-rise">
        SYSTEM READY<span className="animate-blink">_</span>
      </p>

      {/* Headline */}
      <h1 className="text-[2.6rem] leading-[1.05] font-bold text-fg animate-rise">
        Build something
        <br />
        real. <span className="text-accent">Right now.</span>
      </h1>

      {/* Subheadline */}
      <p className="text-base text-fg-mid mt-5 leading-relaxed animate-rise-late">
        Five minutes. No account, no downloads, no experience needed. You leave
        with a working creation — and the code that runs it.
      </p>

      {/* What you can build — quiet signal, not interactive */}
      <div className="flex gap-4 mt-8 animate-rise-late">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">🌐</span>
          <span className="text-xs text-fg-dim">Personal page</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">📱</span>
          <span className="text-xs text-fg-dim">Interactive app</span>
        </div>
      </div>

      {/* Primary CTA — pinned toward the thumb zone */}
      <div className="mt-auto pt-10">
        <Link
          href="/select"
          className="block w-full bg-accent text-on-accent font-bold text-lg py-4 rounded-xl
            text-center transition-transform duration-150 active:scale-[0.98]"
        >
          START BUILD →
        </Link>

        <p className="text-xs text-center text-fg-dim mt-5">
          Powered by CodeBoxx Academy ·{" "}
          <Link href="/about" className="underline underline-offset-2">
            how this was built
          </Link>
        </p>
      </div>
    </main>
  );
}
