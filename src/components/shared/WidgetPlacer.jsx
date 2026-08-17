// WidgetPlacer.jsx — Bottom sheet for choosing where a new module installs.
// Appears after tapping a module tile in the WidgetPanel.

"use client";

const SLOTS = [
  { key: "top",          label: "Top",          description: "Above everything" },
  { key: "after_header", label: "After Header", description: "Below the colored bar" },
  { key: "bottom",       label: "Bottom",       description: "Below all content" },
];

export default function WidgetPlacer({ widgetKey, onConfirm, onCancel }) {
  return (
    <>
      {/* Dark background overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onCancel} />

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-ink-900 border-t border-line rounded-t-2xl p-6 animate-rise">
        <p className="sys text-[10px] text-accent mb-1">INSTALL MODULE</p>
        <p className="text-base font-bold text-fg mb-1">
          Where should it go?
        </p>
        <p className="text-sm text-fg-dim mb-5">You can move it later.</p>

        {/* Slot options */}
        <div className="flex flex-col gap-3">
          {SLOTS.map((slot) => (
            <button
              key={slot.key}
              onClick={() => onConfirm(widgetKey, slot.key)}
              className="w-full flex items-center justify-between border border-line rounded-xl
                px-4 py-3.5 bg-ink-800 text-left active:border-accent transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-fg">{slot.label}</p>
                <p className="text-xs text-fg-dim">{slot.description}</p>
              </div>
              <span className="text-accent text-sm">→</span>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="w-full mt-4 text-sm text-fg-dim py-3"
        >
          Cancel
        </button>
      </div>
    </>
  );
}
