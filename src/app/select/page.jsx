// select/page.jsx — Mission 01: Choose Your Build.
// Two paths, one decision. This is the student's first product decision.

import Link from "next/link";
import { EXPERIENCES } from "@/data/experiences";

const PATH_ICONS = { webpage: "🌐", app: "📱" };

export default function PathSelectPage() {
  return (
    <main className="min-h-dvh lab-grid flex flex-col px-5 pt-6 pb-10 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <Link
          href="/"
          aria-label="Go back"
          className="flex items-center justify-center w-11 h-11 -ml-2 rounded-xl text-fg-mid active:bg-ink-800 shrink-0"
        >
          ←
        </Link>
        <div className="pt-1">
          <p className="sys text-[11px] text-accent mb-1">MISSION 01 — CHOOSE YOUR BUILD</p>
          <h1 className="text-xl font-bold text-fg leading-tight">
            What are you making today?
          </h1>
        </div>
      </div>

      <p className="text-sm text-fg-dim mt-1 mb-7 pl-9">
        Pick one. You can come back and build the other.
      </p>

      {/* Path cards */}
      <div className="flex flex-col gap-4">
        {Object.values(EXPERIENCES).map((exp, index) => (
          <Link
            key={exp.key}
            href={exp.route}
            className={`group relative flex flex-col bg-ink-900 border border-line rounded-2xl p-5
              overflow-hidden transition-transform duration-150 active:scale-[0.985]
              ${index === 0 ? "animate-rise" : "animate-rise-late"}`}
          >
            {/* Accent edge */}
            <span
              className="absolute left-0 top-0 bottom-0 w-1 bg-accent/70"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between mb-3">
              <span className="sys text-[10px] text-accent">{exp.pathTag}</span>
              <span className="sys text-[10px] text-fg-dim">≈ 5 MIN</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden="true">
                {PATH_ICONS[exp.key]}
              </span>
              <div>
                <h2 className="text-lg font-bold text-fg">{exp.title}</h2>
                <p className="text-sm text-fg-mid mt-1 leading-relaxed">
                  {exp.tagline}
                </p>
              </div>
            </div>

            <p className="sys text-[11px] font-bold text-accent text-right mt-4">
              BEGIN →
            </p>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-fg-dim mt-8">
        Every choice you make changes what gets built.
      </p>
    </main>
  );
}
