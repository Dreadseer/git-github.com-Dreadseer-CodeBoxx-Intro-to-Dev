// WidgetCanvas.jsx — Renders installed modules for a specific slot inside the live preview.
// Acts as the drop target for dragged modules. Empty slots stay invisible unless a
// drag is in progress, so the preview reads as the actual creation, not a form.

"use client";

import WidgetItem from "@/components/shared/WidgetItem";

export default function WidgetCanvas({
  widgets,
  slot,
  onDrop,
  onRemove,
  onEdit,
  selectedWidgetId,
  showHints = false,
}) {
  // Only show widgets assigned to this slot
  const slotWidgets = widgets.filter((w) => w.position === slot);

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const widgetKey = e.dataTransfer.getData("widgetKey");
    if (widgetKey) {
      onDrop(widgetKey, slot);
    }
  }

  // Nothing installed and no drag happening — take up no space at all
  if (slotWidgets.length === 0 && !showHints) return null;

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full flex flex-col gap-2"
    >
      {/* Drop hint — only while a module is being dragged */}
      {slotWidgets.length === 0 && showHints && (
        <div className="w-full border-2 border-dashed border-accent/50 bg-accent/5 rounded-lg py-2 text-center text-xs text-gray-500">
          Drop module here
        </div>
      )}

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
