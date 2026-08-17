// WidgetPanel.jsx — Horizontal tray of installable modules.
// Modules can be tapped (mobile) or dragged (desktop) onto the canvas.

"use client";

import { WIDGET_TYPES } from "@/data/widgets";

export default function WidgetPanel({ onSelect, onDragStateChange }) {
  // Stores the module key on drag so drop targets know what was dragged;
  // also flags the drag state so canvas slots can reveal themselves
  function handleDragStart(e, widgetKey) {
    e.dataTransfer.setData("widgetKey", widgetKey);
    onDragStateChange?.(true);
  }

  function handleDragEnd() {
    onDragStateChange?.(false);
  }

  return (
    <div className="w-full mt-6">
      <p className="sys text-[10px] text-fg-dim mb-2">
        MODULES — TAP TO INSTALL
      </p>
      <div className="flex flex-row gap-2.5 overflow-x-auto pb-2">
        {WIDGET_TYPES.map((widget) => (
          <button
            key={widget.key}
            draggable
            onDragStart={(e) => handleDragStart(e, widget.key)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(widget.key)}
            className="flex flex-col items-center justify-center min-w-[76px] min-h-[64px]
              bg-ink-900 border border-line rounded-xl p-2.5 cursor-grab select-none
              transition-transform duration-150 active:scale-95 active:border-accent"
          >
            <span className="text-xl">{widget.icon}</span>
            <span className="text-[11px] text-fg-mid mt-1 text-center leading-tight">
              {widget.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
