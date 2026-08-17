// WidgetItem.jsx — Renders a single installed module with edit and remove controls.
// Lives inside the white creation preview, so it keeps light styling; the accent
// ring marks the module currently open in the editor.

"use client";

export default function WidgetItem({ widget, isSelected, onRemove, onEdit }) {
  return (
    <div
      className={`relative w-full rounded-lg border bg-white p-2.5 animate-pop ${
        isSelected ? "border-accent ring-1 ring-accent" : "border-gray-200"
      }`}
    >
      {/* Remove control — top right corner, full tap target */}
      <button
        onClick={onRemove}
        aria-label="Remove module"
        className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-xs text-gray-400"
      >
        ✕
      </button>

      {/* Tapping the module body opens the editor */}
      <div onClick={onEdit} className="cursor-pointer pr-6">
        <WidgetRenderer widget={widget} />
      </div>
    </div>
  );
}

// Renders the visual output of each module type
function WidgetRenderer({ widget }) {
  const { type, values } = widget;

  if (type === "heading") {
    return <p className="font-bold text-gray-800 text-sm">{values.text || "My Heading"}</p>;
  }

  if (type === "button") {
    return (
      <span className="inline-block bg-gray-800 text-white text-center rounded-lg py-2 px-4 text-xs">
        {values.label || "Click Me"}
      </span>
    );
  }

  if (type === "contact") {
    return (
      <div className="flex flex-col gap-1">
        {["Name", "Email", "Message"].map((field) => (
          <div key={field} className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-400">
            {field}
          </div>
        ))}
      </div>
    );
  }

  if (type === "message_box") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-800">
        {values.text || "Add your message here."}
      </div>
    );
  }

  if (type === "social") {
    return (
      <div className="flex gap-2 flex-wrap">
        {["github", "instagram", "linkedin"].map((platform) => (
          <span key={platform} className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
            {platform}: {values[platform] || "—"}
          </span>
        ))}
      </div>
    );
  }

  return null;
}
