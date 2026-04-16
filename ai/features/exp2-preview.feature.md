# 👁️ FEATURE SPEC — Experience 2: App Live Preview

> **Read `ai-spec.md` first.** This file defines only what is specific to the Experience 2 live preview.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The live preview shows students a working, interactive version of their mini app inside a phone frame — in real time as they fill out the form. Unlike Experience 1's preview which is purely visual, this preview is actually interactive: the button works and cycles through the student's messages as they type them.

---

## Where It Is Used

- Inside `src/app/experience/app/page.jsx` below the step components (already wired in the form spec)
- Inside `src/app/experience/app/result/page.jsx` on the result screen

---

## Components

Two components are built in this feature:

| Component | File | Purpose |
|---|---|---|
| `MessageCycler` | `src/components/app/MessageCycler.jsx` | The actual interactive button + message display. Standalone and reusable. |
| `AppLivePreview` | `src/components/app/AppLivePreview.jsx` | Phone frame wrapper that renders `MessageCycler` with live context data. |

Separating them means `MessageCycler` can be used standalone on the result screen without the phone frame wrapper.

---

## Component: `MessageCycler`

**File:** `src/components/app/MessageCycler.jsx`

**Purpose:** A self-contained interactive widget. Displays a title, a message, and a button. Each tap of the button advances to the next message in a cycle (0 → 1 → 2 → 0 → ...).

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `appTitle` | string | Yes | Displayed as the app heading |
| `buttonLabel` | string | Yes | Text on the tappable button |
| `messages` | array of strings | Yes | The three messages to cycle through |
| `themeColor` | string | Yes | A key from `THEME_COLORS` (e.g. `"blue"`) |
| `compact` | boolean | No | If true, uses smaller text/padding for the phone frame preview. Default: `false` |

**Behavior:**
- Maintains its own `currentIndex` state with `useState(0)`
- Tapping the button increments `currentIndex` by 1, wrapping back to 0 after index 2
- Displays `messages[currentIndex]` as the current message
- Falls back to placeholder text when fields are empty:
  - `appTitle` empty → `"Your App"`
  - `buttonLabel` empty → `"Tap Me"`
  - Current message empty → `"Your message will appear here"`
- Theme color applied via inline style to the button background and title text

**Layout (top to bottom):**
1. App title — bold, centered, theme color text
2. Message display box — rounded box, light gray background, centered message text
3. Button — full width (or near-full), theme color background, white text, `buttonLabel`

**File: `src/components/app/MessageCycler.jsx`**
```jsx
// MessageCycler.jsx — Interactive button and message cycling widget for Experience 2.
// Each tap of the button advances to the next message. Reusable in both preview and result.

"use client";

import { useState } from "react";
import { THEME_COLORS } from "@/data/themes";

export default function MessageCycler({
  appTitle,
  buttonLabel,
  messages,
  themeColor,
  compact = false,
}) {
  // Tracks which message (0, 1, or 2) is currently displayed
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get the full theme object for the selected color key
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["blue"];

  // Advance to the next message, wrapping back to 0 after the last one
  function handleTap() {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  }

  // Use fallback text if any field is empty
  const displayTitle = appTitle || "Your App";
  const displayButton = buttonLabel || "Tap Me";
  const displayMessage =
    messages[currentIndex]?.trim() !== ""
      ? messages[currentIndex]
      : "Your message will appear here";

  return (
    <div className={`flex flex-col items-center gap-3 w-full ${compact ? "px-2 py-2" : "px-4 py-6"}`}>

      {/* App title */}
      <p
        className={`font-bold text-center ${compact ? "text-sm" : "text-xl"}`}
        style={{ color: theme.hex }}
      >
        {displayTitle}
      </p>

      {/* Message display box */}
      <div className={`w-full bg-gray-100 rounded-xl text-center text-gray-700 ${compact ? "text-xs p-3" : "text-base p-5"}`}>
        {displayMessage}
      </div>

      {/* Cycling button */}
      <button
        onClick={handleTap}
        className={`w-full font-bold rounded-xl text-white ${compact ? "text-xs py-2" : "text-lg py-4"}`}
        style={{ backgroundColor: theme.hex }}
      >
        {displayButton}
      </button>

    </div>
  );
}
```

---

## Component: `AppLivePreview`

**File:** `src/components/app/AppLivePreview.jsx`

**Purpose:** Wraps `MessageCycler` in a phone frame, feeding it live values from `AppBuilderContext`. The phone frame is the same style used in Experience 1's preview.

**Props:** None — reads directly from `useAppBuilder()`

**File: `src/components/app/AppLivePreview.jsx`**
```jsx
// AppLivePreview.jsx — Phone-frame wrapper for the App Builder live preview.
// Shows a working interactive version of the student's app as they fill out the form.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import MessageCycler from "@/components/app/MessageCycler";

export default function AppLivePreview() {
  const { formData } = useAppBuilder();

  return (
    <div className="flex justify-center">
      {/* Phone frame outer wrapper */}
      <div className="w-full max-w-[280px] aspect-[9/16] border-4 border-gray-800 rounded-3xl overflow-hidden bg-white flex flex-col justify-center">

        {/* MessageCycler in compact mode for the smaller phone frame */}
        <MessageCycler
          appTitle={formData.appTitle}
          buttonLabel={formData.buttonLabel}
          messages={formData.messages}
          themeColor={formData.themeColor}
          compact={true}
        />

      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

- [ ] `MessageCycler` renders a title, message box, and button
- [ ] Tapping the button advances to the next message
- [ ] After the third message, tapping wraps back to the first message
- [ ] All three fallback placeholders display correctly when fields are empty
- [ ] Theme color is applied to the button background and title via inline `style`
- [ ] `compact={true}` renders visibly smaller text and padding than the default
- [ ] `AppLivePreview` renders `MessageCycler` inside a phone frame
- [ ] Phone frame matches the style used in `WebPageLivePreview` (dark border, rounded corners)
- [ ] Preview updates in real time as the student fills in form fields
- [ ] No console errors or warnings
