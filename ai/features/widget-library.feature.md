# 🧩 FEATURE SPEC — Widget Library (Drag, Drop & Placement)

> **Read `ai-spec.md` first.** This file defines only what is specific to the Widget Library feature.
> The global spec overrides anything here in case of conflict.

---

## Purpose

This feature upgrades both the Web Page Builder and App Builder from fixed-field forms into flexible editors. Students can add widgets to their creation by dragging them into the live preview, or by selecting a widget and choosing a placement position. The live preview updates instantly when a widget is added, moved, or removed.

This is an additive feature — the existing form steps (name, bio, color, etc.) remain unchanged. Widgets are an additional layer of customization on top of the base fields.

---

## Scope

Both experiences share the same widget library and the same drag-and-drop system. The widget panel and canvas are added to the form page of each experience, visible alongside or below the existing step form.

---

## Widget Types

| Widget Key | Label | Icon | Description |
|---|---|---|---|
| `heading` | Text / Heading | `📝` | A short bold heading the student types |
| `button` | Button | `🔘` | A styled button with custom label and link |
| `contact` | Contact Form | `📬` | Name + email + message fields (static display only — no backend) |
| `message_box` | Message Box | `💬` | A styled callout box with custom text |
| `social` | Social Links | `🔗` | Row of icon links (GitHub, Instagram, LinkedIn) with custom URLs |

All widget definitions live in a new static data file: `src/data/widgets.js`

---

## Data File

### `src/data/widgets.js`

```js
// widgets.js — Defines all available widget types for the builder experiences.
// Each widget has a key, label, icon, and the default values it starts with when added.

export const WIDGET_TYPES = [
  {
    key: "heading",
    label: "Text / Heading",
    icon: "📝",
    defaults: { text: "My Heading" },
  },
  {
    key: "button",
    label: "Button",
    icon: "🔘",
    defaults: { label: "Click Me", url: "" },
  },
  {
    key: "contact",
    label: "Contact Form",
    icon: "📬",
    defaults: {},
  },
  {
    key: "message_box",
    label: "Message Box",
    icon: "💬",
    defaults: { text: "Add your message here." },
  },
  {
    key: "social",
    label: "Social Links",
    icon: "🔗",
    defaults: { github: "", instagram: "", linkedin: "" },
  },
];
```

---

## State Changes

### Context Updates

Both `WebPageContext` and `AppBuilderContext` need a new `widgets` array added to their state shape. Each item in the array represents one placed widget instance.

**New field added to both contexts:**
```js
widgets: []  // Array of placed widget instances
```

**Each widget instance shape:**
```js
{
  id: "widget_1716400000000",  // Unique ID — Date.now() string prefixed with "widget_"
  type: "heading",             // Key from WIDGET_TYPES
  position: "bottom",          // "top" | "after_header" | "bottom" — placement slot
  values: { text: "My Heading" } // Editable values, seeded from the widget's defaults
}
```

**New context methods added to both contexts:**
```js
addWidget(type, position)     // Adds a new widget instance with default values
removeWidget(id)              // Removes a widget instance by id
updateWidget(id, key, value)  // Updates a single value field on a widget instance
moveWidget(id, newPosition)   // Changes the position of a widget instance
```

---

## Placement Slots

Both preview canvases have three named placement slots:

| Slot Key | Label | Description |
|---|---|---|
| `top` | Top | Above all other content |
| `after_header` | After Header | Below the colored header band, above the name/title |
| `bottom` | Bottom | Below all existing content |

Multiple widgets can occupy the same slot — they stack in the order they were added.

---

## New Components

All new components live in `src/components/shared/` (shared between both experiences).

| Component | File | Purpose |
|---|---|---|
| `WidgetPanel` | `WidgetPanel.jsx` | Scrollable tray of available widgets — drag source or tap-to-add |
| `WidgetPlacer` | `WidgetPlacer.jsx` | Modal or inline picker for choosing placement slot |
| `WidgetCanvas` | `WidgetCanvas.jsx` | Renders placed widgets inside the preview at their correct slots |
| `WidgetItem` | `WidgetItem.jsx` | Renders a single placed widget in the canvas with edit + remove controls |
| `WidgetEditor` | `WidgetEditor.jsx` | Inline field editor for a selected widget's values |

---

## Component Specifications

---

### `WidgetPanel`

**Purpose:** A horizontal scrollable tray at the bottom of the editor screen showing all available widget types. Each tile is a drag source (desktop) and a tap target (mobile).

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `onSelect` | function | Yes | Called with `(widgetKey)` when a widget tile is tapped |

**Behavior:**
- Renders one tile per entry in `WIDGET_TYPES`
- Each tile shows the widget icon (emoji) and label
- On mobile (tap): calls `onSelect(widgetKey)` which opens the `WidgetPlacer`
- On desktop (drag): sets `draggable={true}` and uses `onDragStart` to store the widget key in `dataTransfer`
- The preview canvas listens for `onDrop` to receive the dragged widget key and position

**Styling:**
- Horizontal flex row, scrollable: `flex flex-row gap-3 overflow-x-auto pb-2`
- Each tile: `flex flex-col items-center justify-center min-w-[72px] bg-white border border-gray-200 rounded-xl p-3 cursor-grab`
- Emoji: `text-2xl`
- Label: `text-xs text-gray-600 mt-1 text-center`

**File: `src/components/shared/WidgetPanel.jsx`**
```jsx
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
```

---

### `WidgetPlacer`

**Purpose:** A bottom sheet style modal that appears after a student taps a widget tile. It shows the three placement slot options and confirms the add action.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `widgetKey` | string | Yes | The key of the widget being placed |
| `onConfirm` | function | Yes | Called with `(widgetKey, position)` when a slot is chosen |
| `onCancel` | function | Yes | Called when the student dismisses without choosing |

**Behavior:**
- Renders as a fixed bottom sheet overlay: `fixed inset-x-0 bottom-0 z-50`
- Dark overlay behind it: `fixed inset-0 bg-black/40 z-40`
- Shows three slot buttons: Top, After Header, Bottom
- Tapping a slot calls `onConfirm(widgetKey, slotKey)` and closes
- Tapping the overlay or a Cancel button calls `onCancel()`

**File: `src/components/shared/WidgetPlacer.jsx`**
```jsx
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
```

---

### `WidgetCanvas`

**Purpose:** Renders placed widgets inside the live preview at their correct slot positions. Also acts as the drop target for dragged widgets.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `widgets` | array | Yes | The `widgets` array from context |
| `slot` | string | Yes | Which slot this canvas instance renders (`"top"`, `"after_header"`, or `"bottom"`) |
| `onDrop` | function | Yes | Called with `(widgetKey, slot)` when a widget is dropped onto this slot |
| `onRemove` | function | Yes | Called with `(widgetId)` to remove a widget |
| `onEdit` | function | Yes | Called with `(widgetId)` to open the editor for a widget |
| `selectedWidgetId` | string | No | The id of the currently selected widget (for highlight purposes) |

**Behavior:**
- Filters `widgets` to only those matching the `slot` prop
- Renders one `WidgetItem` per matching widget
- Accepts drag-and-drop: handles `onDragOver` (prevent default) and `onDrop`
- Shows a dashed drop zone hint when empty: `"Drop here"` placeholder

**File: `src/components/shared/WidgetCanvas.jsx`**
```jsx
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
```

---

### `WidgetItem`

**Purpose:** Renders a single placed widget inside the canvas with a remove button and an edit button. When selected, it shows a highlight ring.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `widget` | object | Yes | The widget instance from context |
| `isSelected` | boolean | No | If true, renders with a highlight ring |
| `onRemove` | function | Yes | Called when the remove button is tapped |
| `onEdit` | function | Yes | Called when the widget body is tapped |

**Widget rendering by type:**

| Type | Rendered As |
|---|---|
| `heading` | `<p className="font-bold text-gray-800">{values.text}</p>` |
| `button` | `<a className="block bg-gray-800 text-white text-center rounded-lg py-2 px-4 text-sm">{values.label}</a>` |
| `contact` | Static display of Name / Email / Message labels with empty input boxes |
| `message_box` | `<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">{values.text}</div>` |
| `social` | Row of icon pills: GitHub / Instagram / LinkedIn with the stored URL as text |

**Highlight styling when `isSelected`:**
- Wrapper: `ring-2 ring-yellow-400 ring-offset-1 rounded-xl`

**File: `src/components/shared/WidgetItem.jsx`**
```jsx
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
```

---

### `WidgetEditor`

**Purpose:** An inline panel that appears below the canvas when a widget is selected. Shows editable fields for the selected widget's values. Updates context in real time via `updateWidget`.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `widget` | object | Yes | The selected widget instance |
| `onUpdate` | function | Yes | Called with `(id, key, value)` to update a widget field |
| `onClose` | function | Yes | Called to deselect/close the editor |
| `onMove` | function | Yes | Called with `(id, newPosition)` to move the widget to a different slot |

**Fields rendered per widget type:**

| Type | Fields |
|---|---|
| `heading` | One text input for `text` |
| `button` | Text input for `label`, text input for `url` |
| `contact` | No editable fields — static display message: `"This shows a contact form on your page."` |
| `message_box` | Textarea for `text` |
| `social` | Three text inputs for `github`, `instagram`, `linkedin` |

**File: `src/components/shared/WidgetEditor.jsx`**
```jsx
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
```

---

## Context Method Implementations

Add these four methods to both `WebPageContext` and `AppBuilderContext`:

```js
// Adds a new widget instance at the chosen position with default values
function addWidget(type, position) {
  const widgetDef = WIDGET_TYPES.find((w) => w.key === type);
  const newWidget = {
    id: `widget_${Date.now()}`,
    type,
    position,
    values: { ...widgetDef.defaults },
  };
  setFormData((prev) => ({
    ...prev,
    widgets: [...prev.widgets, newWidget],
  }));
}

// Removes a widget by its unique id
function removeWidget(id) {
  setFormData((prev) => ({
    ...prev,
    widgets: prev.widgets.filter((w) => w.id !== id),
  }));
}

// Updates a single value field on a widget instance
function updateWidget(id, key, value) {
  setFormData((prev) => ({
    ...prev,
    widgets: prev.widgets.map((w) =>
      w.id === id ? { ...w, values: { ...w.values, [key]: value } } : w
    ),
  }));
}

// Moves a widget to a different placement slot
function moveWidget(id, newPosition) {
  setFormData((prev) => ({
    ...prev,
    widgets: prev.widgets.map((w) =>
      w.id === id ? { ...w, position: newPosition } : w
    ),
  }));
}
```

---

## Integration Into Form Pages

Both `src/app/experience/webpage/page.jsx` and `src/app/experience/app/page.jsx` need the following additions:

```jsx
// New local state for the widget system
const [pendingWidgetKey, setPendingWidgetKey] = useState(null); // widget awaiting placement
const [selectedWidgetId, setSelectedWidgetId] = useState(null); // currently editing widget

// Pull widget methods from context
const { formData, updateField, addWidget, removeWidget, updateWidget, moveWidget } = useWebPage(); // or useAppBuilder()

// Called when a widget tile is tapped — opens the WidgetPlacer
function handleWidgetSelect(widgetKey) {
  setPendingWidgetKey(widgetKey);
}

// Called when drag-and-drop places a widget directly
function handleWidgetDrop(widgetKey, position) {
  addWidget(widgetKey, position);
}

// Called when WidgetPlacer confirms a placement
function handlePlacerConfirm(widgetKey, position) {
  addWidget(widgetKey, position);
  setPendingWidgetKey(null);
}
```

Add below the live preview in the JSX:
```jsx
<WidgetPanel onSelect={handleWidgetSelect} />

{pendingWidgetKey && (
  <WidgetPlacer
    widgetKey={pendingWidgetKey}
    onConfirm={handlePlacerConfirm}
    onCancel={() => setPendingWidgetKey(null)}
  />
)}

{selectedWidgetId && (
  <WidgetEditor
    widget={formData.widgets.find((w) => w.id === selectedWidgetId)}
    onUpdate={updateWidget}
    onClose={() => setSelectedWidgetId(null)}
    onMove={moveWidget}
  />
)}
```

The live preview components (`WebPageLivePreview`, `AppLivePreview`) must also be updated to pass `widgets`, `onDrop`, `onRemove`, `onEdit`, and `selectedWidgetId` down to `WidgetCanvas` instances placed at each slot position inside the phone frame.

---

## Acceptance Criteria

- [ ] `src/data/widgets.js` exists and exports `WIDGET_TYPES` with all 5 widget definitions
- [ ] `widgets: []` is added to the initial state of both contexts
- [ ] All four widget methods (`addWidget`, `removeWidget`, `updateWidget`, `moveWidget`) are implemented in both contexts
- [ ] `WidgetPanel` renders all 5 widget tiles in a horizontal scrollable row
- [ ] Tapping a widget tile opens `WidgetPlacer` with the three slot options
- [ ] Selecting a slot in `WidgetPlacer` adds the widget to the canvas at that position
- [ ] Dragging a widget tile onto a canvas slot adds it at that position (desktop)
- [ ] The placed widget appears in the live preview immediately
- [ ] Tapping a widget in the canvas opens `WidgetEditor`
- [ ] Editing widget fields updates the preview in real time
- [ ] Moving a widget via `WidgetEditor` changes its slot position immediately
- [ ] The remove button (`✕`) deletes the widget from the canvas
- [ ] Multiple widgets can occupy the same slot and stack correctly
- [ ] Empty slots show a dashed `"Drop here"` hint
- [ ] No console errors or warnings
