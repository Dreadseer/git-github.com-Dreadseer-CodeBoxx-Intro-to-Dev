// WidgetPanel.jsx — Horizontal tray of available widget types.
// Widgets can be tapped (mobile) or dragged (desktop) onto the canvas.

"use client";

import { WIDGET_TYPES } from "@/data/widgets";

export default function WidgetPanel({ onSelect }) {
  // Called when a drag starts — stores the widget key so the drop target knows what was dragged
  function handleDragStart(e, widgetKey) {
    e.dataTransfer.setData("widgetKey", widgetKey);
  }

  return (
    <div className="w-full mt-6">
      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        Add a Widget
      </p>
      <div className="flex flex-row gap-3 overflow-x-auto pb-2">
        {WIDGET_TYPES.map((widget) => (
          <div
            key={widget.key}
            draggable
            onDragStart={(e) => handleDragStart(e, widget.key)}
            onClick={() => onSelect(widget.key)}
            className="flex flex-col items-center justify-center min-w-[72px] bg-white border border-gray-200 rounded-xl p-3 cursor-grab select-none"
          >
            <span className="text-2xl">{widget.icon}</span>
            <span className="text-xs text-gray-600 mt-1 text-center leading-tight">
              {widget.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
