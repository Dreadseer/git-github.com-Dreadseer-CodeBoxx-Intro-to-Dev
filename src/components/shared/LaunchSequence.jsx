// LaunchSequence.jsx — Full-screen build sequence shown between the last mission and the result.
// Checklist lines land one by one, the build bar completes, then a single LAUNCH action reveals
// the finished project. This is the completion payoff — kept short so it rewards, not delays.

"use client";

import { useEffect, useState } from "react";

const BUILD_STEPS = [
  "LAYOUT",
  "STYLE",
  "CONTENT",
  "INTERACTIONS",
];

// ~450ms per checklist line keeps the whole sequence under 2.5 seconds
const STEP_INTERVAL_MS = 450;

export default function LaunchSequence({ projectName, onLaunch }) {
  // How many checklist steps have completed so far
  const [completed, setCompleted] = useState(0);
  const ready = completed >= BUILD_STEPS.length;

  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => {
      setCompleted((c) => c + 1);
    }, STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [completed, ready]);

  return (
    <div className="fixed inset-0 z-[70] bg-ink-950 flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-xs">

        {/* System header */}
        <p className="sys text-[11px] text-fg-dim mb-1">
          {ready ? "BUILD COMPLETE" : "BUILDING PROJECT"}
          {!ready && <span className="animate-blink">_</span>}
        </p>
        <p className="text-lg font-bold text-fg mb-6 truncate">{projectName}</p>

        {/* Checklist */}
        <div className="flex flex-col gap-2.5 mb-6" aria-live="polite">
          {BUILD_STEPS.map((step, index) => {
            const done = index < completed;
            const active = index === completed;
            return (
              <div key={step} className="flex items-center justify-between">
                <span
                  className={`sys text-xs ${
                    done ? "text-fg" : active ? "text-fg-mid" : "text-fg-dim/50"
                  }`}
                >
                  {step}
                </span>
                <span className={`sys text-xs ${done ? "text-ok" : "text-fg-dim/50"}`}>
                  {done ? "✓" : active ? "···" : "○"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Build bar with scan sweep while building */}
        <div className="relative h-1.5 rounded-full bg-ink-800 overflow-hidden mb-8">
          <div
            className="build-bar h-full bg-accent rounded-full"
            style={{ width: `${90 + (completed / BUILD_STEPS.length) * 10}%` }}
          />
          {!ready && (
            <div className="absolute inset-y-0 w-1/3 animate-scan bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          )}
        </div>

        {/* Ready state — one strong action */}
        {ready ? (
          <div className="animate-rise">
            <p className="sys text-[11px] text-ok text-center mb-3">
              ● PROJECT READY
            </p>
            <button
              onClick={onLaunch}
              className="w-full bg-accent text-on-accent font-bold text-lg py-4 rounded-xl
                transition-transform duration-150 active:scale-[0.98]"
            >
              LAUNCH ⌁
            </button>
          </div>
        ) : (
          <p className="sys text-[11px] text-fg-dim text-center">
            ASSEMBLING FROM YOUR DECISIONS
          </p>
        )}
      </div>
    </div>
  );
}
