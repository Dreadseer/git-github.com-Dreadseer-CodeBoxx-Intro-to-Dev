# 🐛 BUG FIX SPEC — Widget Selection Not Highlighting in Live Code Panel

> **Read `ai-spec.md` first.** This file defines only what is specific to this bug fix.
> The global spec overrides anything here in case of conflict.

---

## Bug Summary

When a student selects or edits a widget in the builder, the live "See the Code" panel does not highlight the corresponding lines in the generated HTML. The `lastChanged` field in context is set to `"widget"` generically, but `getHighlightKey` maps `"widget"` to a fixed fallback anchor (e.g. `"Made with CodeBoxx"`) rather than the specific widget's type or slot. The result is either no highlight or a highlight on the wrong section.

---

## Root Cause

Two gaps in the current implementation:

1. **`lastChanged` is too coarse** — it stores `"widget"` as a string regardless of which widget was changed or what type it is. There is no way to derive a specific marker from `"widget"` alone.

2. **`getHighlightKey` has no widget-type or slot awareness** — it maps `"widget"` to a single static fallback anchor, which doesn't match the widget's actual position in the generated HTML.

---

## Fix Strategy

### Part 1 — Make `lastChanged` carry widget detail

Instead of setting `lastChanged` to the string `"widget"`, set it to a structured object when a widget changes:

```js
// New shape when a widget is changed
lastChanged: {
  kind: "widget",
  widgetType: "heading",   // the widget's type key
  slot: "top"              // the widget's position slot
}

// Existing shape when a form field is changed (unchanged)
lastChanged: "name"   // still a plain string
```

Update `updateWidget` in both contexts to set this structured value:

```js
function updateWidget(id, key, value) {
  setFormData((prev) => {
    // Find the widget being updated so we know its type and slot
    const widget = prev.widgets.find((w) => w.id === id);
    return {
      ...prev,
      lastChanged: widget
        ? { kind: "widget", widgetType: widget.type, slot: widget.position }
        : prev.lastChanged,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, values: { ...w.values, [key]: value } } : w
      ),
    };
  });
}
```

Also update `addWidget` to set `lastChanged` when a widget is placed:

```js
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
    lastChanged: { kind: "widget", widgetType: type, slot: position },
    widgets: [...prev.widgets, newWidget],
  }));
}
```

---

### Part 2 — Update `getHighlightKey` to handle widget objects

`getHighlightKey` currently only handles plain string field names. It must now also handle the structured widget object and return TWO marker strings — one for the slot block and one for the specific widget type.

Since `CodeBlock` currently accepts one `highlightKey` string, upgrade it to accept either a string or an array of strings. All matched sections are highlighted simultaneously.

#### Updated `getHighlightKey` signature:

```js
// Returns a string, an array of strings, or null
// experience: "webpage" | "app"
export function getHighlightKey(lastChanged, experience) { ... }
```

#### Widget type → comment marker mapping

These must match exactly the HTML comments produced by `widgetToHTML` in `generateWebPageCode.js` and `generateAppCode.js`:

| Widget Type | Comment Marker in Generated Code |
|---|---|
| `heading` | `Custom heading widget` |
| `button` | `Custom button widget` |
| `contact` | `Contact form widget` |
| `message_box` | `Message box widget` |
| `social` | `Social links widget` |

#### Slot → comment marker mapping

| Slot | Comment Marker in Generated Code |
|---|---|
| `top` | `Top widgets` |
| `after_header` | `After header widgets` |
| `bottom` | `Bottom widgets` |

#### Full updated `getHighlightKey`:

```js
// getHighlightKey.js — Maps a changed field or widget to the matching comment markers in the generated code.
// Returns a string for field changes, an array of strings for widget changes, or null if no match.

const WEBPAGE_FIELD_MARKERS = {
  name:       "This displays your name",
  dreamJob:   "This displays your dream job",
  bio:        "This displays your bio",
  themeColor: "This sets your page's color",
  avatar:     "This is your header bar with your chosen icon",
};

const APP_FIELD_MARKERS = {
  appTitle:    "This is your app title",
  buttonLabel: "This is your button",
  messages:    "These are your three messages",
  themeColor:  "This sets your app's color",
};

const WIDGET_TYPE_MARKERS = {
  heading:     "Custom heading widget",
  button:      "Custom button widget",
  contact:     "Contact form widget",
  message_box: "Message box widget",
  social:      "Social links widget",
};

const SLOT_MARKERS = {
  top:          "Top widgets",
  after_header: "After header widgets",
  bottom:       "Bottom widgets",
};

export function getHighlightKey(lastChanged, experience) {
  // No change yet
  if (!lastChanged) return null;

  // Widget change — return both the slot marker and the widget type marker
  if (typeof lastChanged === "object" && lastChanged.kind === "widget") {
    const slotMarker = SLOT_MARKERS[lastChanged.slot] || null;
    const typeMarker = WIDGET_TYPE_MARKERS[lastChanged.widgetType] || null;
    // Return array of all non-null markers
    return [slotMarker, typeMarker].filter(Boolean);
  }

  // Plain field change — return the single matching marker string
  const map = experience === "app" ? APP_FIELD_MARKERS : WEBPAGE_FIELD_MARKERS;
  return map[lastChanged] || null;
}
```

---

### Part 3 — Update `CodeBlock` to accept array `highlightKey`

`CodeBlock` currently expects `highlightKey` to be a string. Update `getHighlightedLineIndices` to accept either a string or an array of strings and highlight all matching sections.

```jsx
// Updated prop type — string | string[] | null
export default function CodeBlock({ code, language = "HTML", highlightKey = null }) {
  // ...existing code...
}

// Updated helper — normalise to array, highlight all matched sections
function getHighlightedLineIndices(lines, highlightKey) {
  if (!highlightKey) return [];

  // Normalise to array so we can handle both string and array inputs
  const keys = Array.isArray(highlightKey) ? highlightKey : [highlightKey];

  const result = new Set();

  keys.forEach((key) => {
    if (!key) return;

    const startIndex = lines.findIndex((line) => line.includes(key));
    if (startIndex === -1) return;

    result.add(startIndex);

    for (let i = startIndex + 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("<!--") || trimmed.startsWith("//")) break;
      if (trimmed === "") break;
      result.add(i);
    }
  });

  return Array.from(result);
}
```

---

## Files Modified

| File | Change |
|---|---|
| `src/context/WebPageContext.jsx` | Update `addWidget` and `updateWidget` to set structured `lastChanged` |
| `src/context/AppBuilderContext.jsx` | Update `addWidget` and `updateWidget` to set structured `lastChanged` |
| `src/utils/getHighlightKey.js` | Full rewrite — handles string and object `lastChanged`, returns string or array |
| `src/components/shared/CodeBlock.jsx` | Update `getHighlightedLineIndices` to accept string or array `highlightKey` |

---

## Acceptance Criteria

- [ ] Adding a widget sets `lastChanged` to `{ kind: "widget", widgetType, slot }` in both contexts
- [ ] Editing a widget field sets `lastChanged` to the same structured object
- [ ] `getHighlightKey` returns an array of two marker strings when `lastChanged` is a widget object
- [ ] `getHighlightKey` returns a single string when `lastChanged` is a plain field name
- [ ] `getHighlightKey` returns `null` when `lastChanged` is `null`
- [ ] `CodeBlock` highlights all lines matching any marker in the array
- [ ] Adding a `top` slot widget highlights both `"Top widgets"` and the widget type comment
- [ ] Adding an `after_header` slot widget highlights both `"After header widgets"` and the widget type comment
- [ ] Adding a `bottom` slot widget highlights both `"Bottom widgets"` and the widget type comment
- [ ] Editing a heading widget highlights `"Custom heading widget"` and its slot
- [ ] Field changes (name, bio, etc.) continue to highlight their single section correctly
- [ ] No console errors or warnings
