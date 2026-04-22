// WidgetPlacer.jsx — Bottom sheet modal for choosing where to place a new widget.
// Appears after tapping a widget tile in the WidgetPanel.

"use client";

const SLOTS = [
  { key: "top",          label: "Top",          description: "Above everything" },
  { key: "after_header", label: "After Header",  description: "Below the colored bar" },
  { key: "bottom",       label: "Bottom",        description: "Below all content" },
];

export default function WidgetPlacer({ widgetKey, onConfirm, onCancel }) {
  return (
    <>
      {/* Dark background overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onCancel}
      />

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl p-6 shadow-xl">
        <p className="text-base font-bold text-gray-900 mb-1">
          Where do you want to place it?
        </p>
        <p className="text-sm text-gray-500 mb-5">
          You can move it later.
        </p>

        {/* Slot options */}
        <div className="flex flex-col gap-3">
          {SLOTS.map((slot) => (
            <button
              key={slot.key}
              onClick={() => onConfirm(widgetKey, slot.key)}
              className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{slot.label}</p>
                <p className="text-xs text-gray-500">{slot.description}</p>
              </div>
              <span className="text-gray-400 text-sm">→</span>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="w-full mt-4 text-sm text-gray-400 py-2"
        >
          Cancel
        </button>
      </div>
    </>
  );
}
