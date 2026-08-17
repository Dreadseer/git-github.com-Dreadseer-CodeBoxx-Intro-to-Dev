// CodeBlock.jsx — Displays generated code with section-level highlighting and auto-scroll.
// The highlighted section updates when the student changes a field or module.

"use client";

import { useEffect, useRef } from "react";

export default function CodeBlock({ code, language = "HTML", highlightKey = null }) {
  // Ref attached to the first highlighted line — used to scroll it into view
  const highlightRef = useRef(null);

  // Split the code into individual lines for per-line rendering
  const lines = code.split("\n");

  // Determine which line indices belong to the highlighted section
  const highlightedLines = getHighlightedLineIndices(lines, highlightKey);

  // Scroll the highlighted section into view whenever highlightKey changes
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightKey]);

  // Boolean flag to ensure the ref is only attached to the first highlighted line
  let firstHighlightAssigned = false;

  return (
    <div className="w-full">
      {/* Console chrome bar */}
      <div className="bg-ink-800 border-y border-line px-5 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent/70" aria-hidden="true" />
        <span className="sys text-[10px] text-fg-mid">{language}</span>
      </div>

      {/* Code display — scrollable horizontally and vertically */}
      <div className="bg-[#0d1117] overflow-x-auto overflow-y-auto max-h-[400px]">
        <pre className="text-xs font-mono p-5 whitespace-pre">
          {lines.map((line, index) => {
            const isHighlighted = highlightedLines.includes(index);
            const shouldAttachRef = isHighlighted && !firstHighlightAssigned;
            if (shouldAttachRef) firstHighlightAssigned = true;
            return (
              <span
                key={index}
                ref={shouldAttachRef ? highlightRef : null}
                className={`block ${
                  isHighlighted
                    ? "bg-accent/15 text-accent"
                    : "text-gray-200"
                }`}
              >
                {line}
              </span>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

// Finds the line indices that belong to all sections matching any marker in highlightKey.
// Accepts a string or array of strings. Uses a Set to avoid duplicate indices.
function getHighlightedLineIndices(lines, highlightKey) {
  if (!highlightKey) return [];

  // Normalise to array so we can handle both string and array inputs
  const keys = Array.isArray(highlightKey) ? highlightKey : [highlightKey];

  const result = new Set();

  keys.forEach((key) => {
    if (!key) return;

    const startIndex = lines.findIndex((line) => line.includes(key));
    if (startIndex === -1) return;

    result.add(startIndex);

    for (let i = startIndex + 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("<!--") || trimmed.startsWith("//")) break;
      if (trimmed === "") break;
      result.add(i);
    }
  });

  return Array.from(result);
}
