# 🎨 FEATURE SPEC — Code Block Highlighting & Auto-Scroll

> **Read `ai-spec.md` first.** This file defines only what is specific to the Code Highlighting feature.
> The global spec overrides anything here in case of conflict.

---

## Purpose

When a student changes a form field or adds/edits a widget, the corresponding section of their generated code in `SeeTheCodePanel` is highlighted in a different color and scrolled into view automatically. This bridges the gap between "thing I built" and "code that powers it" — students see exactly which lines their choices produced.

---

## Where It Lives

This feature is an upgrade to the existing `SeeTheCodePanel` and `CodeBlock` components built in the `see-the-code.feature.md` spec. It does not add new files — it modifies existing ones and adds one new utility.

---

## Files Modified

| File | Change |
|---|---|
| `src/components/shared/SeeTheCodePanel.jsx` | Accepts a `highlightKey` prop, passes it to `CodeBlock` |
| `src/components/shared/CodeBlock.jsx` | Parses the code string into sections, highlights the active one, auto-scrolls |
| `src/app/experience/webpage/result/page.jsx` | Tracks which field was last changed and passes `highlightKey` |
| `src/app/experience/app/result/page.jsx` | Tracks which field was last changed and passes `highlightKey` |

---

## New File

| File | Purpose |
|---|---|
| `src/utils/getHighlightKey.js` | Maps a form field name or widget id to the section label used in the generated code |

---

## How It Works — Overview

1. The generated HTML code (`generateWebPageCode` / `generateAppCode`) already contains comments on every meaningful section — e.g. `<!-- This displays your name -->`
2. Each comment acts as a **section marker** — a known string we can search for
3. When a student changes a field or widget, a `highlightKey` string is set in state on the result page
4. `getHighlightKey` maps that field name (e.g. `"name"`) to the marker string in the generated code (e.g. `"This displays your name"`)
5. `CodeBlock` splits the code string into lines, finds the section containing that marker, and applies a highlight background to those lines
6. The highlighted section is scrolled into view using a `ref`

---

## Section Markers

These are the comment strings already present in the generated HTML that serve as anchors. They must match exactly what `generateWebPageCode` and `generateAppCode` output.

### Experience 1 — Web Page

| Field / Change | Marker String in Generated Code |
|---|---|
| `name` | `This displays your name` |
| `dreamJob` | `This displays your dream job` |
| `bio` | `This displays your bio` |
| `themeColor` | `This sets your page's color` |
| `avatar` | `This is your header bar with your chosen icon` |
| widget added/edited | `Made with CodeBoxx` (bottom — nearest anchor for appended widgets) |

### Experience 2 — App

| Field / Change | Marker String in Generated Code |
|---|---|
| `appTitle` | `This is your app title` |
| `buttonLabel` | `This is your button` |
| `messages` | `These are your three messages` |
| `themeColor` | `This sets your app's color` (in the `<style>` block) |
| widget added/edited | `This is the footer credit` |

---

## Utility: `getHighlightKey`

**File:** `src/utils/getHighlightKey.js`

```js
// getHighlightKey.js — Maps a changed field name to the matching comment marker in the generated code.
// Used by the result pages to tell CodeBlock which section to highlight.

// Experience 1 field → marker mappings
const WEBPAGE_MARKERS = {
  name:       "This displays your name",
  dreamJob:   "This displays your dream job",
  bio:        "This displays your bio",
  themeColor: "This sets your page's color",
  avatar:     "This is your header bar with your chosen icon",
  widget:     "Made with CodeBoxx",
};

// Experience 2 field → marker mappings
const APP_MARKERS = {
  appTitle:    "This is your app title",
  buttonLabel: "This is your button",
  messages:    "These are your three messages",
  themeColor:  "This sets your app's color",
  widget:      "This is the footer credit",
};

// Returns the marker string for a given field and experience type
// experience: "webpage" | "app"
export function getHighlightKey(fieldName, experience) {
  const map = experience === "app" ? APP_MARKERS : WEBPAGE_MARKERS;
  return map[fieldName] || null;
}
```

---

## Updated: `SeeTheCodePanel`

Add a `highlightKey` prop. Pass it through to `CodeBlock`.

```jsx
// Updated props
export default function SeeTheCodePanel({ code, highlightKey = null }) {

  // ... existing state and toggle logic unchanged ...

  return (
    <div className="w-full my-4">
      {/* header toggle — unchanged */}
      {isOpen && (
        <div className="border border-gray-200 border-t-0 rounded-b-2xl overflow-hidden">
          <p className="text-sm text-gray-500 px-5 pt-4 pb-2">
            Here's the code that builds your creation. Every line is commented
            so you can see exactly what it does.
          </p>

          {/* Pass highlightKey down to CodeBlock */}
          <CodeBlock code={code} highlightKey={highlightKey} />
        </div>
      )}
    </div>
  );
}
```

---

## Updated: `CodeBlock`

This is the most significant change. `CodeBlock` now:
1. Splits the `code` string into individual lines
2. Identifies which lines belong to the highlighted section (the block containing `highlightKey`)
3. Renders each line individually, applying a highlight background to lines in the active section
4. Uses a `ref` on the first highlighted line to scroll it into view when `highlightKey` changes

**Section detection logic:**
- A "section" is the comment line containing the marker plus all non-comment lines immediately following it, up to the next comment line or blank line
- Comment lines start with `<!--` or `//`

```jsx
// CodeBlock.jsx — Displays generated code with section-level highlighting and auto-scroll.
// The highlighted section updates when the student changes a field or widget.

"use client";

import { useEffect, useRef } from "react";

export default function CodeBlock({ code, language = "HTML", highlightKey = null }) {
  // Ref attached to the first highlighted line — used to scroll it into view
  const highlightRef = useRef(null);

  // Split the code into individual lines for per-line rendering
  const lines = code.split("\n");

  // Determine which line indices belong to the highlighted section
  const highlightedLines = getHighlightedLineIndices(lines, highlightKey);

  // Scroll the highlighted section into view whenever highlightKey changes
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightKey]);

  return (
    <div className="w-full">
      {/* Language label pill */}
      <div className="bg-gray-800 px-5 py-2 flex items-center">
        <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
          {language}
        </span>
      </div>

      {/* Code display — scrollable horizontally */}
      <div className="bg-gray-900 overflow-x-auto overflow-y-auto max-h-[400px]">
        <pre className="text-xs font-mono p-5 whitespace-pre">
          {lines.map((line, index) => {
            const isHighlighted = highlightedLines.includes(index);
            return (
              <span
                key={index}
                // Attach the ref to the first highlighted line
                ref={isHighlighted && highlightRef.current === null ? highlightRef : null}
                className={`block ${
                  isHighlighted
                    ? "bg-yellow-500/20 text-yellow-200"
                    : "text-gray-100"
                }`}
              >
                {line}
              </span>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

// Finds the line indices that belong to the section containing the highlightKey marker.
// A section starts at the comment line with the marker and ends before the next comment or blank line.
function getHighlightedLineIndices(lines, highlightKey) {
  if (!highlightKey) return [];

  // Find the line index that contains the marker string
  const startIndex = lines.findIndex((line) => line.includes(highlightKey));
  if (startIndex === -1) return [];

  const result = [startIndex];

  // Walk forward from the marker line, collecting lines until the next comment or blank line
  for (let i = startIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Stop at the next comment line
    if (trimmed.startsWith("<!--") || trimmed.startsWith("//")) break;

    // Stop at a blank line (section boundary)
    if (trimmed === "") break;

    result.push(i);
  }

  return result;
}
```

---

## Tracking `highlightKey` on Result Pages

Both result pages need to track which field was last changed and derive the `highlightKey` from it.

### How to trigger highlighting

The result page is currently static — it generates code once on render. To support highlighting, the result page needs to know which field the student most recently interacted with.

**Approach:** Pass a `lastChanged` prop from the form page through to the result page via a URL query param, or store it in context.

**Recommended approach — store `lastChanged` in context:**

Add `lastChanged: null` to both contexts. Add an `setLastChanged(fieldName)` method. Call it inside `updateField` and `updateWidget` automatically:

```js
// In both contexts — update updateField to also set lastChanged
function updateField(key, value) {
  setFormData((prev) => ({ ...prev, [key]: value, lastChanged: key }));
}

// And updateWidget:
function updateWidget(id, key, value) {
  setFormData((prev) => ({
    ...prev,
    lastChanged: "widget",
    widgets: prev.widgets.map((w) =>
      w.id === id ? { ...w, values: { ...w.values, [key]: value } } : w
    ),
  }));
}
```

Then on the result pages:

```jsx
// In webpage/result/page.jsx
import { getHighlightKey } from "@/utils/getHighlightKey";

const { formData } = useWebPage();
const highlightKey = getHighlightKey(formData.lastChanged, "webpage");

// Pass to SeeTheCodePanel
<SeeTheCodePanel code={generatedCode} highlightKey={highlightKey} />
```

```jsx
// In app/result/page.jsx
import { getHighlightKey } from "@/utils/getHighlightKey";

const { formData } = useAppBuilder();
const highlightKey = getHighlightKey(formData.lastChanged, "app");

<SeeTheCodePanel code={generatedCode} highlightKey={highlightKey} />
```

---

## Acceptance Criteria

- [ ] `src/utils/getHighlightKey.js` exists and maps all field names correctly for both experiences
- [ ] `lastChanged` field is added to the initial state of both contexts (defaults to `null`)
- [ ] `updateField` automatically sets `lastChanged` to the changed field key in both contexts
- [ ] `updateWidget` automatically sets `lastChanged` to `"widget"` in both contexts
- [ ] `SeeTheCodePanel` accepts and passes through the `highlightKey` prop
- [ ] `CodeBlock` splits code into individual lines and renders each as a `<span>`
- [ ] Lines in the highlighted section render with `bg-yellow-500/20 text-yellow-200`
- [ ] Non-highlighted lines render with `text-gray-100` (unchanged)
- [ ] The first highlighted line is scrolled into view smoothly when `highlightKey` changes
- [ ] When no field has been changed (`highlightKey` is null), no lines are highlighted
- [ ] The panel auto-opens when a field is changed and `highlightKey` is set (optional enhancement — document but do not require)
- [ ] No console errors or warnings on either result screen
