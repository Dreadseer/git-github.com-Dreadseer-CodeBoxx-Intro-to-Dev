// WidgetEditor.jsx — Inline configuration panel for the selected module.
// Appears below the canvas when a module is tapped. Updates context in real time.

"use client";

const SLOT_OPTIONS = [
  { key: "top",          label: "Top" },
  { key: "after_header", label: "After Header" },
  { key: "bottom",       label: "Bottom" },
];

const inputClasses =
  "w-full bg-ink-950 border border-line-strong rounded-xl px-4 py-3 text-base text-fg " +
  "placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-accent";

export default function WidgetEditor({ widget, onUpdate, onClose, onMove }) {
  if (!widget) return null;

  return (
    <div className="w-full bg-ink-900 border border-line rounded-2xl p-4 mt-4 animate-rise">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="sys text-[10px] text-accent">CONFIGURE MODULE</p>
        <button
          onClick={onClose}
          className="text-xs text-fg-mid font-semibold px-3 py-1.5 rounded-lg bg-ink-800"
        >
          Done
        </button>
      </div>

      {/* Fields for the selected module type */}
      <WidgetFields widget={widget} onUpdate={onUpdate} />

      {/* Move to a different slot */}
      <div className="mt-4">
        <p className="sys text-[10px] text-fg-dim mb-2">MOVE TO</p>
        <div className="flex gap-2">
          {SLOT_OPTIONS.map((slot) => (
            <button
              key={slot.key}
              onClick={() => onMove(widget.id, slot.key)}
              className={`text-xs px-3 py-2 rounded-full border transition-colors ${
                widget.position === slot.key
                  ? "bg-accent text-on-accent border-accent font-bold"
                  : "bg-ink-800 text-fg-mid border-line"
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

// Renders the correct input fields for each module type
function WidgetFields({ widget, onUpdate }) {
  const { id, type, values } = widget;

  if (type === "heading") {
    return (
      <input
        type="text"
        value={values.text}
        onChange={(e) => onUpdate(id, "text", e.target.value)}
        placeholder="My Heading"
        className={inputClasses}
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
          className={inputClasses}
        />
        <input
          type="url"
          value={values.url}
          onChange={(e) => onUpdate(id, "url", e.target.value)}
          placeholder="https://yourlink.com (optional)"
          className={inputClasses}
        />
      </div>
    );
  }

  if (type === "contact") {
    return (
      <p className="text-sm text-fg-dim">
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
        className={`${inputClasses} resize-none`}
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
            className={inputClasses}
          />
        ))}
      </div>
    );
  }

  return null;
}
