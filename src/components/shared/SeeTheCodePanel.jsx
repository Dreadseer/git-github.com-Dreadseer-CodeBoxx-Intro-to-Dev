// SeeTheCodePanel.jsx — Expandable panel that reveals the generated code on the result screen.
// Collapsed by default so students choose when to explore it.

"use client";

import { useState } from "react";
import CodeBlock from "@/components/shared/CodeBlock";

export default function SeeTheCodePanel({ code, highlightKey = null, defaultOpen = false }) {
  // Controls whether the panel is open or closed
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full my-4">

      {/* Panel header — always visible, toggles the panel open/closed */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-gray-50 border border-gray-200 px-5 py-4 ${
          isOpen ? "rounded-t-2xl border-b-0" : "rounded-2xl"
        }`}
      >
        <span className="text-sm font-bold text-gray-700">&lt;/&gt; See the Code</span>
        <span className="text-gray-500 text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Expandable content — only rendered when open */}
      {isOpen && (
        <div className="border border-gray-200 border-t-0 rounded-b-2xl overflow-hidden">

          {/* Intro sentence */}
          <p className="text-sm text-gray-500 px-5 pt-4 pb-2">
            Here's the code that builds your creation. Every line is commented
            so you can see exactly what it does.
          </p>

          {/* Code block displaying the full generated HTML */}
          <CodeBlock code={code} highlightKey={highlightKey} />

        </div>
      )}

    </div>
  );
}
