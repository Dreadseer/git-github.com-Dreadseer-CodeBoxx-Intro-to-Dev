// WidgetItem.jsx — Renders a single placed widget with edit and remove controls.
// Highlighted with a yellow ring when selected.

"use client";

export default function WidgetItem({ widget, isSelected, onRemove, onEdit }) {
  return (
    <div
      className={`relative w-full rounded-xl border border-gray-200 bg-white p-3 ${
        isSelected ? "ring-2 ring-yellow-400 ring-offset-1" : ""
      }`}
    >
      {/* Remove button — top right corner */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-xs text-gray-400 hover:text-red-400"
      >
        ✕
      </button>

      {/* Tapping the widget body opens the editor */}
      <div onClick={onEdit} className="cursor-pointer pr-6">
        <WidgetRenderer widget={widget} />
      </div>
    </div>
  );
}

// Renders the visual output of each widget type
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
