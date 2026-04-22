# 🐛 BUG FIX SPEC — Widgets Not Rendering on Result Screens

> **Read `ai-spec.md` first.** This file defines only what is specific to this bug fix.
> The global spec overrides anything here in case of conflict.

---

## Bug Summary

Widgets added during the builder experience are stored correctly in context but are never rendered on the result screens. `WebPageResultCard` and `AppResultCard` only render the base form fields (name, bio, theme, etc.) and completely ignore `formData.widgets`. Students finish building, hit the result screen, and see none of their widget work.

---

## Root Cause

`WebPageResultCard` and `AppResultCard` read `formData` from context but never access `formData.widgets`. The result cards have no awareness of placed widgets and no logic to render them at their correct slot positions.

---

## Files Modified

| File | Change |
|---|---|
| `src/components/webpage/WebPageResultCard.jsx` | Render `formData.widgets` at correct slot positions |
| `src/components/app/AppResultCard.jsx` | Render `formData.widgets` at correct slot positions |

Both files also need a new helper component — `WidgetResultRenderer` — defined locally inside each file. This is a lightweight version of `WidgetItem` without the edit/remove controls, purely for display.

---

## Slot Rendering Order

Both result cards must render widgets in their correct slot positions relative to the existing card content. The slot order maps to the card layout as follows:

### Web Page Result Card — Slot Positions

```
[ top slot widgets ]
──────────────────────────────
[ colored header band + avatar ]   ← existing
──────────────────────────────
[ after_header slot widgets ]
──────────────────────────────
[ name ]                           ← existing
[ dream job ]                      ← existing
[ divider ]                        ← existing
[ bio ]                            ← existing
──────────────────────────────
[ bottom slot widgets ]
──────────────────────────────
[ "Made with CodeBoxx" footer ]    ← existing
```

### App Result Card — Slot Positions

```
[ top slot widgets ]
──────────────────────────────
[ thin accent stripe ]             ← existing
──────────────────────────────
[ after_header slot widgets ]
──────────────────────────────
[ MessageCycler ]                  ← existing
──────────────────────────────
[ bottom slot widgets ]
──────────────────────────────
```

---

## `WidgetResultRenderer` Helper

This is a read-only display component — no edit button, no remove button, no selection ring. It renders the visual output of a widget instance for the result screen. Define it at the bottom of each result card file (not exported — local use only).

```jsx
// Renders the visual output of a single widget for the result screen.
// Read-only — no edit or remove controls.
function WidgetResultRenderer({ widget }) {
  const { type, values } = widget;

  if (type === "heading") {
    return (
      <p className="font-bold text-gray-800 text-sm px-6 py-2">
        {values.text || "My Heading"}
      </p>
    );
  }

  if (type === "button") {
    return (
      <div className="px-6 py-2">
        <span className="inline-block bg-gray-800 text-white text-center rounded-lg py-2 px-4 text-xs">
          {values.label || "Click Me"}
        </span>
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className="flex flex-col gap-1 px-6 py-2">
        {["Name", "Email", "Message"].map((field) => (
          <div
            key={field}
            className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-400"
          >
            {field}
          </div>
        ))}
      </div>
    );
  }

  if (type === "message_box") {
    return (
      <div className="mx-6 my-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        {values.text || "Add your message here."}
      </div>
    );
  }

  if (type === "social") {
    return (
      <div className="flex gap-2 flex-wrap px-6 py-2">
        {["github", "instagram", "linkedin"].map((platform) => (
          values[platform] ? (
            <span
              key={platform}
              className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600"
            >
              {platform}: {values[platform]}
            </span>
          ) : null
        ))}
      </div>
    );
  }

  return null;
}
```

---

## Slot Renderer Helper

Both result cards need a helper function that filters `widgets` by slot and renders them in order. Define it locally in each file:

```jsx
// Renders all widgets assigned to a specific placement slot
function SlotWidgets({ widgets, slot }) {
  const slotWidgets = widgets.filter((w) => w.position === slot);
  if (slotWidgets.length === 0) return null;

  return (
    <>
      {slotWidgets.map((widget) => (
        <WidgetResultRenderer key={widget.id} widget={widget} />
      ))}
    </>
  );
}
```

---

## Updated: `WebPageResultCard`

**Full file replacement — provide complete contents.**

```jsx
// WebPageResultCard.jsx — Full-width display of the student's finished personal landing page.
// Renders base content AND all placed widgets at their correct slot positions.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export default function WebPageResultCard() {
  const { formData } = useWebPage();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["purple"];
  const avatarEmoji =
    AVATAR_OPTIONS.find((a) => a.key === formData.avatar)?.emoji || "🚀";
  const widgets = formData.widgets || [];

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* TOP slot widgets */}
      <SlotWidgets widgets={widgets} slot="top" />

      {/* Colored header band with avatar */}
      <div
        className="flex items-center justify-center h-20"
        style={{ backgroundColor: theme.hex }}
      >
        <span className="text-4xl">{avatarEmoji}</span>
      </div>

      {/* AFTER_HEADER slot widgets */}
      <SlotWidgets widgets={widgets} slot="after_header" />

      {/* Card body — base content */}
      <div className="flex flex-col items-center px-6 py-5 bg-white">

        {/* Student name */}
        <p
          className="text-2xl font-bold text-center"
          style={{ color: theme.hex }}
        >
          {formData.name}
        </p>

        {/* Dream job */}
        <p className="text-sm text-gray-500 text-center mt-1">
          {formData.dreamJob}
        </p>

        {/* Divider */}
        <div
          className="w-12 h-0.5 my-4 rounded-full"
          style={{ backgroundColor: theme.hex }}
        />

        {/* Bio */}
        <p className="text-sm text-gray-600 text-center leading-relaxed">
          {formData.bio}
        </p>

      </div>

      {/* BOTTOM slot widgets */}
      <SlotWidgets widgets={widgets} slot="bottom" />

      {/* Footer tag */}
      <p className="text-xs text-gray-400 text-center py-4">
        Made with CodeBoxx
      </p>

    </div>
  );
}

// Renders all widgets for a given placement slot
function SlotWidgets({ widgets, slot }) {
  const slotWidgets = widgets.filter((w) => w.position === slot);
  if (slotWidgets.length === 0) return null;
  return (
    <>
      {slotWidgets.map((widget) => (
        <WidgetResultRenderer key={widget.id} widget={widget} />
      ))}
    </>
  );
}

// Read-only widget renderer for the result screen — no edit or remove controls
function WidgetResultRenderer({ widget }) {
  const { type, values } = widget;

  if (type === "heading") {
    return (
      <p className="font-bold text-gray-800 text-sm px-6 py-2">
        {values.text || "My Heading"}
      </p>
    );
  }

  if (type === "button") {
    return (
      <div className="px-6 py-2">
        <span className="inline-block bg-gray-800 text-white text-center rounded-lg py-2 px-4 text-xs">
          {values.label || "Click Me"}
        </span>
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className="flex flex-col gap-1 px-6 py-2">
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
      <div className="mx-6 my-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        {values.text || "Add your message here."}
      </div>
    );
  }

  if (type === "social") {
    return (
      <div className="flex gap-2 flex-wrap px-6 py-2">
        {["github", "instagram", "linkedin"].map((platform) =>
          values[platform] ? (
            <span key={platform} className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
              {platform}: {values[platform]}
            </span>
          ) : null
        )}
      </div>
    );
  }

  return null;
}
```

---

## Updated: `AppResultCard`

**Full file replacement — provide complete contents.**

```jsx
// AppResultCard.jsx — Full-width card displaying the student's working interactive app.
// Renders placed widgets at their correct slot positions alongside the MessageCycler.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import { THEME_COLORS } from "@/data/themes";
import MessageCycler from "@/components/app/MessageCycler";

export default function AppResultCard() {
  const { formData } = useAppBuilder();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["blue"];
  const widgets = formData.widgets || [];

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* TOP slot widgets */}
      <SlotWidgets widgets={widgets} slot="top" />

      {/* Thin colored accent stripe */}
      <div
        className="w-full h-2"
        style={{ backgroundColor: theme.hex }}
      />

      {/* AFTER_HEADER slot widgets */}
      <SlotWidgets widgets={widgets} slot="after_header" />

      {/* Live interactive app — full size */}
      <div className="bg-white">
        <MessageCycler
          appTitle={formData.appTitle}
          buttonLabel={formData.buttonLabel}
          messages={formData.messages}
          themeColor={formData.themeColor}
          compact={false}
        />
      </div>

      {/* BOTTOM slot widgets */}
      <SlotWidgets widgets={widgets} slot="bottom" />

    </div>
  );
}

// Renders all widgets for a given placement slot
function SlotWidgets({ widgets, slot }) {
  const slotWidgets = widgets.filter((w) => w.position === slot);
  if (slotWidgets.length === 0) return null;
  return (
    <>
      {slotWidgets.map((widget) => (
        <WidgetResultRenderer key={widget.id} widget={widget} />
      ))}
    </>
  );
}

// Read-only widget renderer for the result screen — no edit or remove controls
function WidgetResultRenderer({ widget }) {
  const { type, values } = widget;

  if (type === "heading") {
    return (
      <p className="font-bold text-gray-800 text-sm px-6 py-2">
        {values.text || "My Heading"}
      </p>
    );
  }

  if (type === "button") {
    return (
      <div className="px-6 py-2">
        <span className="inline-block bg-gray-800 text-white text-center rounded-lg py-2 px-4 text-xs">
          {values.label || "Click Me"}
        </span>
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className="flex flex-col gap-1 px-6 py-2">
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
      <div className="mx-6 my-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        {values.text || "Add your message here."}
      </div>
    );
  }

  if (type === "social") {
    return (
      <div className="flex gap-2 flex-wrap px-6 py-2">
        {["github", "instagram", "linkedin"].map((platform) =>
          values[platform] ? (
            <span key={platform} className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
              {platform}: {values[platform]}
            </span>
          ) : null
        )}
      </div>
    );
  }

  return null;
}
```

---

## Acceptance Criteria

- [ ] Widgets placed in the `top` slot appear above the header band on the result card
- [ ] Widgets placed in the `after_header` slot appear between the header band and the main content
- [ ] Widgets placed in the `bottom` slot appear below the main content
- [ ] Multiple widgets in the same slot stack in the order they were added
- [ ] Slots with no widgets render nothing — no empty space or placeholder shown
- [ ] `social` widget only renders platforms where the student entered a URL — empty platforms are hidden
- [ ] The `WidgetResultRenderer` has no edit button, remove button, or selection ring
- [ ] The `MessageCycler` in `AppResultCard` remains fully interactive on the result screen
- [ ] `formData.widgets || []` guard prevents crashes if widgets key is somehow undefined
- [ ] No console errors or warnings on either result screen
