# 💻 FEATURE SPEC — See the Code Panel

> **Read `ai-spec.md` first.** This file defines only what is specific to the See the Code Panel.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The "See the Code" panel is the educational centerpiece of both result screens. It shows students the actual HTML, CSS, and JavaScript that powers the thing they just built — in a friendly, expandable panel with syntax-highlighted code blocks. The goal is to spark curiosity, not overwhelm. The code shown is the output of `generateWebPageCode` or `generateAppCode` — real code built from their real inputs.

---

## Where It Is Used

- `src/app/experience/webpage/result/page.jsx` — replaces the `SeeTheCodePanel` placeholder
- `src/app/experience/app/result/page.jsx` — replaces the `SeeTheCodePanel` placeholder

---

## Files

| File | Purpose |
|---|---|
| `src/components/shared/SeeTheCodePanel.jsx` | Expandable panel — header, toggle, and CodeBlock children |
| `src/components/shared/CodeBlock.jsx` | Displays a single labeled block of code with syntax styling |

---

## Component: `SeeTheCodePanel`

**File:** `src/components/shared/SeeTheCodePanel.jsx`

**Purpose:** A collapsible panel that reveals the full generated HTML code when tapped. Collapsed by default so it doesn't overwhelm students on arrival — they choose to explore it.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | The full generated HTML string from `generateWebPageCode` or `generateAppCode` |

**Behavior:**
- Collapsed by default — `isOpen` starts as `false`
- Tapping the header row toggles `isOpen`
- When collapsed: shows only the header row with a `▼` chevron
- When expanded: shows the header row with a `▲` chevron, an intro sentence, and the `CodeBlock`
- The full `code` string is passed as a single block to one `CodeBlock` — no splitting required
- Smooth expand/collapse using CSS `max-height` transition

**Header row content:**
- Left: `</> See the Code` label in a bold, small font
- Right: `▼` or `▲` chevron depending on state
- Background: `bg-gray-50`
- Border: `border border-gray-200`
- Rounded when collapsed: `rounded-2xl`
- Rounded top only when expanded: `rounded-t-2xl`
- Padding: `px-5 py-4`

**Intro sentence (shown when expanded):**
- Text: `"Here's the code that builds your creation. Every line is commented so you can see exactly what it does."`
- Style: `text-sm text-gray-500 px-5 pt-4`

**Full File: `src/components/shared/SeeTheCodePanel.jsx`**
```jsx
// SeeTheCodePanel.jsx — Expandable panel that reveals the generated code on the result screen.
// Collapsed by default so students choose when to explore it.

"use client";

import { useState } from "react";
import CodeBlock from "@/components/shared/CodeBlock";

export default function SeeTheCodePanel({ code }) {
  // Controls whether the panel is open or closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full my-4">

      {/* Panel header — always visible, toggles the panel open/closed */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-gray-50 border border-gray-200 px-5 py-4 ${
          isOpen ? "rounded-t-2xl border-b-0" : "rounded-2xl"
        }`}
      >
        <span className="text-sm font-bold text-gray-700">&lt;/&gt; See the Code</span>
        <span className="text-gray-500 text-sm">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Expandable content — only rendered when open */}
      {isOpen && (
        <div className="border border-gray-200 border-t-0 rounded-b-2xl overflow-hidden">

          {/* Intro sentence */}
          <p className="text-sm text-gray-500 px-5 pt-4 pb-2">
            Here's the code that builds your creation. Every line is commented
            so you can see exactly what it does.
          </p>

          {/* Code block displaying the full generated HTML */}
          <CodeBlock code={code} />

        </div>
      )}

    </div>
  );
}
```

---

## Component: `CodeBlock`

**File:** `src/components/shared/CodeBlock.jsx`

**Purpose:** Displays a block of code with a dark background, monospace font, and horizontal scrolling for long lines. Keeps it simple — no external syntax highlighting library. The comments in the generated code provide the educational value; the styling just makes it readable.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | The raw code string to display |
| `language` | string | No | Label shown above the block (e.g. `"HTML"`). Defaults to `"HTML"` |

**Behavior:**
- Dark background: `bg-gray-900`
- Monospace font: `font-mono`
- Small text: `text-xs`
- Light text color: `text-gray-100`
- Horizontal scroll for long lines: `overflow-x-auto`
- Preserves whitespace and line breaks: `whitespace-pre`
- Padding: `p-5`
- No border radius on the block itself — the parent panel handles rounding
- Language label displayed above the code area in a small pill: `bg-gray-700 text-gray-300 text-xs px-3 py-1`

**Full File: `src/components/shared/CodeBlock.jsx`**
```jsx
// CodeBlock.jsx — Displays a block of code with dark background and monospace font.
// Used inside SeeTheCodePanel to show students the generated HTML and JavaScript.

export default function CodeBlock({ code, language = "HTML" }) {
  return (
    <div className="w-full">

      {/* Language label pill */}
      <div className="bg-gray-800 px-5 py-2 flex items-center">
        <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
          {language}
        </span>
      </div>

      {/* Code display area */}
      <div className="bg-gray-900 overflow-x-auto">
        <pre className="text-xs text-gray-100 font-mono p-5 whitespace-pre">
          {code}
        </pre>
      </div>

    </div>
  );
}
```

---

## Replacing Placeholders on Result Screens

Once these components are built, replace the placeholder divs on both result pages with the real imports.

### In `src/app/experience/webpage/result/page.jsx`:
```jsx
// Replace this:
<div className="my-4 p-4 bg-gray-100 rounded-xl text-sm text-gray-500">See the Code panel coming soon</div>

// With this:
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
// ...
<SeeTheCodePanel code={generatedCode} />
```

### In `src/app/experience/app/result/page.jsx`:
```jsx
// Replace this:
<div className="my-4 p-4 bg-gray-100 rounded-xl text-sm text-gray-500">See the Code panel coming soon</div>

// With this:
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
// ...
<SeeTheCodePanel code={generatedCode} />
```

---

## Acceptance Criteria

- [ ] `SeeTheCodePanel` renders a visible header row on both result screens
- [ ] Panel is collapsed by default — code is not visible on page load
- [ ] Tapping the header expands the panel and shows the code
- [ ] Tapping the header again collapses the panel
- [ ] Chevron icon changes between `▼` and `▲` based on open/closed state
- [ ] The intro sentence is visible when the panel is expanded
- [ ] `CodeBlock` renders the full generated HTML string with dark background and monospace font
- [ ] Long lines in the code block scroll horizontally — they do not wrap
- [ ] The language label pill displays `"HTML"` above the code area
- [ ] The placeholder divs on both result pages have been replaced with real `SeeTheCodePanel` imports
- [ ] No console errors or warnings on either result screen
