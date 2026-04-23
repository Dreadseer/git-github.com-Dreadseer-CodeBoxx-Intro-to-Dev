// CodeBlock.jsx — Displays generated code with section-level highlighting.
// Highlighted section updates when the student changes a field or widget.
// Note: auto-scroll to highlighted section has been intentionally removed.

"use client";

export default function CodeBlock({ code, language = "HTML", highlightKey = null }) {
  // Split the code into individual lines for per-line rendering
  const lines = code.split("\n");

  // Determine which line indices belong to the highlighted section
  const highlightedLines = getHighlightedLineIndices(lines, highlightKey);

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
            return (
              <span
                key={index}
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

// Finds the line indices that belong to all sections matching the highlightKey.
// Accepts a string or an array of strings.
function getHighlightedLineIndices(lines, highlightKey) {
  if (!highlightKey) return [];

  // Normalise to array so we handle both string and array inputs
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
