// WidgetEditor.jsx — Inline editor panel for the currently selected widget.
// Appears below the canvas when a widget is tapped. Updates context in real time.

"use client";

const SLOT_OPTIONS = [
  { key: "top",          label: "Top" },
  { key: "after_header", label: "After Header" },
  { key: "bottom",       label: "Bottom" },
];

export default function WidgetEditor({ widget, onUpdate, onClose, onMove }) {
  if (!widget) return null;

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-800">Edit Widget</p>
        <button onClick={onClose} className="text-xs text-gray-400">Done</button>
      </div>

      {/* Fields for the selected widget type */}
      <WidgetFields widget={widget} onUpdate={onUpdate} />

      {/* Move to a different slot */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Move to</p>
        <div className="flex gap-2">
          {SLOT_OPTIONS.map((slot) => (
            <button
              key={slot.key}
              onClick={() => onMove(widget.id, slot.key)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                widget.position === slot.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// Renders the correct input fields for each widget type
function WidgetFields({ widget, onUpdate }) {
  const { id, type, values } = widget;

  if (type === "heading") {
    return (
      <input
        type="text"
        value={values.text}
        onChange={(e) => onUpdate(id, "text", e.target.value)}
        placeholder="My Heading"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    );
  }

  if (type === "button") {
    return (
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={values.label}
          onChange={(e) => onUpdate(id, "label", e.target.value)}
          placeholder="Button label"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="url"
          value={values.url}
          onChange={(e) => onUpdate(id, "url", e.target.value)}
          placeholder="https://yourlink.com (optional)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    );
  }

  if (type === "contact") {
    return (
      <p className="text-sm text-gray-500">
        This shows a contact form on your page. No edits needed.
      </p>
    );
  }

  if (type === "message_box") {
    return (
      <textarea
        value={values.text}
        onChange={(e) => onUpdate(id, "text", e.target.value)}
        placeholder="Add your message here."
        rows={3}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
      />
    );
  }

  if (type === "social") {
    return (
      <div className="flex flex-col gap-3">
        {["github", "instagram", "linkedin"].map((platform) => (
          <input
            key={platform}
            type="url"
            value={values[platform]}
            onChange={(e) => onUpdate(id, platform, e.target.value)}
            placeholder={`${platform}.com/yourhandle`}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        ))}
      </div>
    );
  }

  return null;
}
