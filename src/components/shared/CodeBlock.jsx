// CodeBlock.jsx — Displays a block of code with dark background and monospace font.
// Used inside SeeTheCodePanel to show students the generated HTML and JavaScript.

export default function CodeBlock({ code, language = "HTML" }) {
  return (
    <div className="w-full">

      {/* Language label pill */}
      <div className="bg-gray-800 px-5 py-2 flex items-center">
        <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
          {language}
        </span>
      </div>

      {/* Code display area */}
      <div className="bg-gray-900 overflow-x-auto">
        <pre className="text-xs text-gray-100 font-mono p-5 whitespace-pre">
          {code}
        </pre>
      </div>

    </div>
  );
}
