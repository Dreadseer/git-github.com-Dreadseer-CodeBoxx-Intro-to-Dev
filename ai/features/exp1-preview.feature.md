# 👁️ FEATURE SPEC — Experience 1: Web Page Live Preview

> **Read `ai-spec.md` first.** This file defines only what is specific to the Experience 1 live preview.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The live preview shows students a real-time representation of their personal landing page as they fill out the form. It renders inside a phone-frame wrapper so students can see exactly what their page will look like on a phone screen. The preview updates instantly as context values change — no button press required.

---

## Where It Is Used

`WebPageLivePreview` is a component, not a page. It is rendered inside the form page (`/experience/webpage`) below the active step component, and again on the result screen.

> **Implementation note for the form page:** The form page (`page.jsx`) built in the previous feature does not yet include the preview. Once this component exists, add it below the step component inside `PageShell` in `page.jsx`.

---

## Updated `page.jsx` Addition

Add `WebPageLivePreview` to the bottom of the form page after all step components are in place:

```jsx
// Add this import at the top of page.jsx
import WebPageLivePreview from "@/components/webpage/WebPageLivePreview";

// Add this below the step rendering block, inside PageShell
<div className="mt-8">
  <p className="text-xs text-center text-gray-400 mb-2">Live preview</p>
  <WebPageLivePreview />
</div>
```

---

## Component: `WebPageLivePreview`

**File:** `src/components/webpage/WebPageLivePreview.jsx`

**Purpose:** Renders a scaled-down phone-frame containing a live preview of the student's personal landing page. Updates in real time from `WebPageContext`.

**Props:** None — reads directly from `useWebPage()`

---

### Phone Frame Wrapper

- Outer container: fixed aspect ratio simulating a phone screen
- Width: `100%` up to `280px` max, centered
- Aspect ratio: `9/16` via `padding-bottom` trick or Tailwind `aspect-[9/16]`
- Border: `border-4 border-gray-800 rounded-3xl`
- Overflow hidden so preview content stays inside the frame
- Background: white

### Preview Content (inside the phone frame)

The content inside the frame mirrors what the student's real HTML page will look like. It is built with JSX, not an `<iframe>`.

Layout (top to bottom):
1. **Header bar** — full-width colored bar using the student's theme color (inline style)
   - Height: `64px`
   - Displays the avatar emoji centered, large (`text-3xl`)
2. **Name** — bold, large text, centered, below the header
   - Uses theme color for text: inline style `color: theme.hex`
   - Falls back to `"Your Name"` if `formData.name` is empty
3. **Dream Job** — smaller text, centered, muted gray
   - Falls back to `"Dream Job"` if empty
4. **Divider** — thin horizontal line in the theme color
5. **Bio** — body text, centered, gray, small
   - Falls back to `"Your bio will appear here."` if empty
6. **Footer tag** — very small, muted: `"Made with CodeBoxx"`

### Fallback Placeholders

When fields are empty, the preview shows placeholder text in a lighter style so the layout doesn't collapse:

| Field Empty | Placeholder Shown |
|---|---|
| `name` | `"Your Name"` |
| `dreamJob` | `"Dream Job"` |
| `bio` | `"Your bio will appear here."` |

---

### Full File

**`src/components/webpage/WebPageLivePreview.jsx`**
```jsx
// WebPageLivePreview.jsx — Live preview of the student's personal landing page.
// Updates in real time as the student fills out the form.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export default function WebPageLivePreview() {
  const { formData } = useWebPage();

  // Get the full theme object (hex, text color) for the selected theme key
  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["purple"];

  // Get the emoji for the selected avatar key
  const avatarEmoji =
    AVATAR_OPTIONS.find((a) => a.key === formData.avatar)?.emoji || "🚀";

  return (
    <div className="flex justify-center">
      {/* Phone frame outer wrapper */}
      <div className="w-full max-w-[280px] aspect-[9/16] border-4 border-gray-800 rounded-3xl overflow-hidden bg-white flex flex-col">

        {/* Colored header bar with avatar emoji */}
        <div
          className="flex items-center justify-center h-16 flex-shrink-0"
          style={{ backgroundColor: theme.hex }}
        >
          <span className="text-3xl">{avatarEmoji}</span>
        </div>

        {/* Page content */}
        <div className="flex flex-col items-center px-4 py-4 flex-1 overflow-hidden">

          {/* Student name */}
          <p
            className="text-lg font-bold text-center leading-tight"
            style={{ color: theme.hex }}
          >
            {formData.name || "Your Name"}
          </p>

          {/* Dream job */}
          <p className="text-xs text-gray-500 text-center mt-1">
            {formData.dreamJob || "Dream Job"}
          </p>

          {/* Divider */}
          <div
            className="w-12 h-0.5 my-3 rounded-full"
            style={{ backgroundColor: theme.hex }}
          />

          {/* Bio */}
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            {formData.bio || "Your bio will appear here."}
          </p>

          {/* Footer tag */}
          <p className="text-[10px] text-gray-400 mt-auto pt-2">
            Made with CodeBoxx
          </p>

        </div>
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

- [ ] `WebPageLivePreview` renders inside a visible phone frame
- [ ] The phone frame has a dark border and rounded corners resembling a device
- [ ] The header bar background color updates immediately when the student changes theme
- [ ] The avatar emoji updates immediately when the student selects a different icon
- [ ] The name, dream job, and bio update in real time as the student types
- [ ] Placeholder text is shown for any empty field — layout does not collapse
- [ ] Theme color is applied via inline `style` — not a Tailwind class
- [ ] Preview is centered horizontally and does not overflow its container
- [ ] No console errors or warnings
