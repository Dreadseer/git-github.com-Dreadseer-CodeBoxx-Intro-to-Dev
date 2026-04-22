// CodeBlock.jsx — Displays generated code with section-level highlighting and auto-scroll.
// The highlighted section updates when the student changes a field or widget.

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
      {/* Language label pill */}
      <div className="bg-gray-800 px-5 py-2 flex items-center">
        <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
          {language}
        </span>
      </div>

      {/* Code display — scrollable horizontally and vertically */}
      <div className="bg-gray-900 overflow-x-auto overflow-y-auto max-h-[400px]">
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
                    ? "bg-yellow-500/20 text-yellow-200"
                    : "text-gray-100"
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

// Finds the line indices that belong to the section containing the highlightKey marker.
// A section starts at the comment line with the marker and ends before the next comment or blank line.
function getHighlightedLineIndices(lines, highlightKey) {
  if (!highlightKey) return [];

  // Find the line index that contains the marker string
  const startIndex = lines.findIndex((line) => line.includes(highlightKey));
  if (startIndex === -1) return [];

  const result = [startIndex];

  // Walk forward from the marker line, collecting lines until the next comment or blank line
  for (let i = startIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Stop at the next comment line
    if (trimmed.startsWith("<!--") || trimmed.startsWith("//")) break;

    // Stop at a blank line (section boundary)
    if (trimmed === "") break;

    result.push(i);
  }

  return result;
}
