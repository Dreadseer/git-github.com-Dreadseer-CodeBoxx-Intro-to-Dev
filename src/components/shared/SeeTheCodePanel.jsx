// SeeTheCodePanel.jsx — Expandable console that reveals the generated source code.
// The point of the whole product: your choices ARE this code.

"use client";

import { useState } from "react";
import CodeBlock from "@/components/shared/CodeBlock";

export default function SeeTheCodePanel({ code, highlightKey = null, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const lineCount = code.split("\n").length;

  return (
    <div className="w-full my-4">

      {/* Panel header — always visible, toggles the panel open/closed */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between bg-ink-900 border border-line px-5 py-4 ${
          isOpen ? "rounded-t-2xl border-b-0" : "rounded-2xl"
        }`}
      >
        <span className="sys text-[11px] text-fg">
          <span className="text-accent">&lt;/&gt;</span> SOURCE — {lineCount} LINES
        </span>
        <span className="text-fg-dim text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Expandable content — only rendered when open */}
      {isOpen && (
        <div className="border border-line border-t-0 rounded-b-2xl overflow-hidden bg-ink-900">
          <p className="text-sm text-fg-dim px-5 pt-4 pb-2">
            This is real code, generated from your decisions. Every line is
            commented so you can see exactly what it does.
          </p>
          <CodeBlock code={code} highlightKey={highlightKey} />
        </div>
      )}

    </div>
  );
}
