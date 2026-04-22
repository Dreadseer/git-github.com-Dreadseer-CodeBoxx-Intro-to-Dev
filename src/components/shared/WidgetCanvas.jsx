// WidgetCanvas.jsx — Renders placed widgets for a specific slot inside the live preview.
// Also acts as the drop target for dragged widgets.

"use client";

import WidgetItem from "@/components/shared/WidgetItem";

export default function WidgetCanvas({
  widgets,
  slot,
  onDrop,
  onRemove,
  onEdit,
  selectedWidgetId,
}) {
  // Only show widgets assigned to this slot
  const slotWidgets = widgets.filter((w) => w.position === slot);

  // Allow dragged items to be dropped here
  function handleDragOver(e) {
    e.preventDefault();
  }

  // Read the widget key from the drag data and notify the parent
  function handleDrop(e) {
    e.preventDefault();
    const widgetKey = e.dataTransfer.getData("widgetKey");
    if (widgetKey) {
      onDrop(widgetKey, slot);
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full min-h-[40px] flex flex-col gap-2"
    >
      {/* Empty slot hint */}
      {slotWidgets.length === 0 && (
        <div className="w-full border-2 border-dashed border-gray-200 rounded-lg py-2 text-center text-xs text-gray-400">
          Drop here
        </div>
      )}

      {/* Render each widget in this slot */}
      {slotWidgets.map((widget) => (
        <WidgetItem
          key={widget.id}
          widget={widget}
          isSelected={widget.id === selectedWidgetId}
          onRemove={() => onRemove(widget.id)}
          onEdit={() => onEdit(widget.id)}
        />
      ))}
    </div>
  );
}
