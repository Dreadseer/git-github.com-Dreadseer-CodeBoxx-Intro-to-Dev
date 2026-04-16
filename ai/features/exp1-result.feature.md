# 🏆 FEATURE SPEC — Experience 1: Web Page Result Screen

> **Read `ai-spec.md` first.** This file defines only what is specific to the Experience 1 result screen.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The result screen is the payoff moment. The student sees their finished personal landing page, gets to explore the code that powers it, and is shown the CodeBoxx call-to-action. It should feel like a genuine accomplishment.

---

## Route

| Route | File |
|---|---|
| `/experience/webpage/result` | `src/app/experience/webpage/result/page.jsx` |

---

## Redirect Guard

If a student navigates directly to this URL without going through the form, `formData.name` will be empty. In that case, redirect them to `/select` immediately.

```jsx
// At the top of the component, before rendering anything
if (!formData.name) {
  redirect("/select");
}
```

Import `redirect` from `"next/navigation"`.

---

## Layout and Content (top to bottom)

1. **StepHeader**
   - No back arrow
   - Title: `"Your page is ready! 🎉"`

2. **WebPageResultCard**
   - The finished personal landing page card (full preview, not phone-framed)
   - See component spec below

3. **SeeTheCodePanel**
   - Expandable panel revealing the generated HTML
   - See `see-the-code.feature.md` for full spec
   - Pass the output of `generateWebPageCode(formData)` as the `code` prop

4. **CodeBoxxCTA**
   - Full-width CTA block
   - See `cta.feature.md` for full spec

---

## Page File

### `src/app/experience/webpage/result/page.jsx`

```jsx
// result/page.jsx — Experience 1 result screen.
// Shows the student their finished personal landing page, the code behind it, and the CodeBoxx CTA.

"use client";

import { redirect } from "next/navigation";
import { useWebPage } from "@/context/WebPageContext";
import PageShell from "@/components/shared/PageShell";
import StepHeader from "@/components/shared/StepHeader";
import WebPageResultCard from "@/components/webpage/WebPageResultCard";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
import { generateWebPageCode } from "@/utils/generateWebPageCode";

export default function WebPageResultPage() {
  const { formData } = useWebPage();

  // Guard: if the form was never filled, send the student back to the selector
  if (!formData.name) {
    redirect("/select");
  }

  // Generate the HTML code string from the student's form data
  const generatedCode = generateWebPageCode(formData);

  return (
    <PageShell>
      <StepHeader title="Your page is ready! 🎉" />
      <WebPageResultCard />
      <SeeTheCodePanel code={generatedCode} />
      <CodeBoxxCTA />
    </PageShell>
  );
}
```

---

## Component: `WebPageResultCard`

**File:** `src/components/webpage/WebPageResultCard.jsx`

**Purpose:** Displays the student's finished personal landing page as a full-width styled card — not inside a phone frame. This is the "hero" moment of the result screen.

**Props:** None — reads directly from `useWebPage()`

### Layout (top to bottom inside the card):

1. **Colored header band** — full width, `80px` tall, theme color background, avatar emoji centered (`text-4xl`)
2. **Student name** — large, bold, centered, theme color text
3. **Dream job** — smaller, centered, gray
4. **Divider line** — thin, theme color, centered, `48px` wide
5. **Bio** — body text, centered, gray
6. **Footer tag** — `"Made with CodeBoxx"`, small, muted, bottom of card

### Card Styling:
- Full width, rounded: `rounded-2xl`
- Border: `border border-gray-200`
- Shadow: `shadow-md`
- Overflow hidden (so the colored header band fills edge to edge): `overflow-hidden`
- No internal horizontal padding on the header band — it must span the full card width

### Full File

**`src/components/webpage/WebPageResultCard.jsx`**
```jsx
// WebPageResultCard.jsx — Full-width display of the student's finished personal landing page.
// The hero moment on the result screen.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export default function WebPageResultCard() {
  const { formData } = useWebPage();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["purple"];
  const avatarEmoji =
    AVATAR_OPTIONS.find((a) => a.key === formData.avatar)?.emoji || "🚀";

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* Colored header band with avatar */}
      <div
        className="flex items-center justify-center h-20"
        style={{ backgroundColor: theme.hex }}
      >
        <span className="text-4xl">{avatarEmoji}</span>
      </div>

      {/* Card body */}
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

        {/* Footer tag */}
        <p className="text-xs text-gray-400 mt-5">Made with CodeBoxx</p>

      </div>
    </div>
  );
}
```

---

## Utility: `generateWebPageCode`

**File:** `src/utils/generateWebPageCode.js`

**Purpose:** Generates a complete HTML string from the student's form data. This is the code shown in the "See the Code" panel. It must be beginner-readable with plain-English comments on every meaningful line.

**Input:** The full `formData` object from `WebPageContext`

**Output:** A single HTML string

```js
// generateWebPageCode.js — Builds a complete HTML page string from the student's form data.
// This is the code revealed in the "See the Code" section on the result screen.

import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export function generateWebPageCode({ name, dreamJob, bio, themeColor, avatar }) {
  // Look up the hex color for the chosen theme
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["purple"];

  // Look up the emoji for the chosen avatar
  const emoji =
    AVATAR_OPTIONS.find((a) => a.key === avatar)?.emoji || "🚀";

  // Return a complete HTML page as a template string
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- This tells the browser what kind of document this is -->
  <meta charset="UTF-8" />

  <!-- This makes the page look good on mobile phones -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- This is the title shown in the browser tab -->
  <title>${name}'s Page</title>

  <style>
    /* This resets default browser spacing */
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background: #ffffff;
      text-align: center;
    }

    /* This is the colored bar at the top of your page */
    .header {
      background-color: ${theme.hex};
      padding: 32px 16px;
      font-size: 48px;
    }

    /* This styles your name */
    .name {
      color: ${theme.hex};
      font-size: 28px;
      font-weight: bold;
      margin: 20px 0 4px;
    }

    /* This styles your dream job title */
    .job {
      color: #6b7280;
      font-size: 14px;
      margin: 0 0 16px;
    }

    /* This is the short divider line */
    .divider {
      width: 48px;
      height: 2px;
      background-color: ${theme.hex};
      margin: 0 auto 16px;
      border-radius: 2px;
    }

    /* This styles your bio text */
    .bio {
      color: #374151;
      font-size: 14px;
      max-width: 320px;
      margin: 0 auto;
      line-height: 1.6;
      padding: 0 16px;
    }

    /* This is the small footer at the bottom */
    .footer {
      color: #9ca3af;
      font-size: 11px;
      margin-top: 32px;
      padding-bottom: 24px;
    }
  </style>
</head>
<body>

  <!-- This is your header bar with your chosen icon -->
  <div class="header">${emoji}</div>

  <!-- This displays your name -->
  <p class="name">${name}</p>

  <!-- This displays your dream job -->
  <p class="job">${dreamJob}</p>

  <!-- This is the decorative line between your title and bio -->
  <div class="divider"></div>

  <!-- This displays your bio -->
  <p class="bio">${bio}</p>

  <!-- This is the footer credit -->
  <p class="footer">Made with CodeBoxx</p>

</body>
</html>`;
}
```

---

## Acceptance Criteria

- [ ] Page loads at `/experience/webpage/result` after completing the form
- [ ] Navigating directly to `/experience/webpage/result` redirects to `/select`
- [ ] `WebPageResultCard` displays the student's name, dream job, bio, avatar, and theme color
- [ ] Theme color is applied via inline styles — not Tailwind classes
- [ ] `SeeTheCodePanel` is present on the page (can be a placeholder until that feature is built)
- [ ] `CodeBoxxCTA` is present on the page (can be a placeholder until that feature is built)
- [ ] `generateWebPageCode` returns a valid HTML string containing the student's actual data
- [ ] The generated HTML includes beginner-friendly comments on every meaningful line
- [ ] No console errors or warnings
