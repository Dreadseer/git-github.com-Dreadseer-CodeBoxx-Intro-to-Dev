// FormField.jsx — Labeled text input or textarea with consistent lab styling.
// Keeps every mission form visually identical without repeating classes.

"use client";

const fieldClasses =
  "bg-ink-950 border border-line-strong rounded-xl px-4 py-3 text-base text-fg " +
  "placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-accent";

export default function FormField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-fg-mid">{label}</label>
      {hint && <p className="text-xs text-fg-dim">{hint}</p>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${fieldClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={fieldClasses}
        />
      )}
    </div>
  );
}
