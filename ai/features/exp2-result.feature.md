# 🏆 FEATURE SPEC — Experience 2: App Result Screen

> **Read `ai-spec.md` first.** This file defines only what is specific to the Experience 2 result screen.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The result screen is the payoff moment for Experience 2. The student sees their fully working interactive app, can tap the button to cycle their own messages, explores the code that makes it work, and is shown the CodeBoxx call-to-action.

---

## Route

| Route | File |
|---|---|
| `/experience/app/result` | `src/app/experience/app/result/page.jsx` |

---

## Redirect Guard

If a student navigates directly to this URL without completing the form, `formData.appTitle` will be empty. Redirect them to `/select` immediately.

```jsx
if (!formData.appTitle) {
  redirect("/select");
}
```

---

## Layout and Content (top to bottom)

1. **StepHeader**
   - No back arrow
   - Title: `"Your app is ready! 🎉"`

2. **AppResultCard**
   - Full-width card containing a live, interactive `MessageCycler`
   - See component spec below

3. **SeeTheCodePanel**
   - Expandable panel revealing the generated HTML + JS
   - Pass the output of `generateAppCode(formData)` as the `code` prop

4. **CodeBoxxCTA**
   - Full-width CTA block

---

## Page File

### `src/app/experience/app/result/page.jsx`

```jsx
// result/page.jsx — Experience 2 result screen.
// Shows the student their working interactive app, the code behind it, and the CodeBoxx CTA.

"use client";

import { redirect } from "next/navigation";
import { useAppBuilder } from "@/context/AppBuilderContext";
import PageShell from "@/components/shared/PageShell";
import StepHeader from "@/components/shared/StepHeader";
import AppResultCard from "@/components/app/AppResultCard";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
import { generateAppCode } from "@/utils/generateAppCode";

export default function AppResultPage() {
  const { formData } = useAppBuilder();

  // Guard: if the form was never filled, send the student back to the selector
  if (!formData.appTitle) {
    redirect("/select");
  }

  // Generate the HTML + JS code string from the student's form data
  const generatedCode = generateAppCode(formData);

  return (
    <PageShell>
      <StepHeader title="Your app is ready! 🎉" />
      <AppResultCard />
      <SeeTheCodePanel code={generatedCode} />
      <CodeBoxxCTA />
    </PageShell>
  );
}
```

---

## Component: `AppResultCard`

**File:** `src/components/app/AppResultCard.jsx`

**Purpose:** Displays the student's finished app as a full-width card with a live, working `MessageCycler` inside it. The student can tap the button and see their messages cycle.

**Props:** None — reads directly from `useAppBuilder()`

### Card Styling:
- Full width, rounded: `rounded-2xl`
- Border: `border border-gray-200`
- Shadow: `shadow-md`
- Overflow hidden: `overflow-hidden`
- Top accent bar in theme color: `height: 8px`, full width (like a colored stripe at the very top)
- White background for the card body

### Layout inside the card:
1. **Thin accent bar** — `8px` tall, full width, theme color (inline style)
2. **`MessageCycler`** — full-size (not compact), padded inside the card

**File: `src/components/app/AppResultCard.jsx`**
```jsx
// AppResultCard.jsx — Full-width card displaying the student's working interactive app.
// The MessageCycler inside is live — the student can tap the button to cycle messages.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import { THEME_COLORS } from "@/data/themes";
import MessageCycler from "@/components/app/MessageCycler";

export default function AppResultCard() {
  const { formData } = useAppBuilder();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["blue"];

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* Thin colored accent stripe at the top of the card */}
      <div
        className="w-full h-2"
        style={{ backgroundColor: theme.hex }}
      />

      {/* Live interactive app — full size, not compact */}
      <div className="bg-white">
        <MessageCycler
          appTitle={formData.appTitle}
          buttonLabel={formData.buttonLabel}
          messages={formData.messages}
          themeColor={formData.themeColor}
          compact={false}
        />
      </div>

    </div>
  );
}
```

---

## Utility: `generateAppCode`

**File:** `src/utils/generateAppCode.js`

**Purpose:** Generates a complete HTML + JavaScript string from the student's form data. The output is shown in the "See the Code" panel. It must be beginner-readable with plain-English comments explaining what every piece does.

**Input:** The full `formData` object from `AppBuilderContext`

**Output:** A single HTML string that includes inline CSS and a `<script>` block

```js
// generateAppCode.js — Builds a complete HTML + JavaScript app string from the student's form data.
// This is the code revealed in the "See the Code" section on the result screen.

import { THEME_COLORS } from "@/data/themes";

export function generateAppCode({ appTitle, buttonLabel, messages, themeColor }) {
  // Look up the hex color for the chosen theme
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["blue"];

  // Turn the messages array into a JavaScript array string for the generated code
  const messagesAsJS = JSON.stringify(messages);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- This tells the browser what kind of document this is -->
  <meta charset="UTF-8" />

  <!-- This makes the page look good on mobile phones -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- This is the title shown in the browser tab -->
  <title>${appTitle}</title>

  <style>
    /* This resets default browser spacing */
    body {
      margin: 0;
      padding: 24px 16px;
      font-family: sans-serif;
      background: #ffffff;
      text-align: center;
    }

    /* This styles your app title */
    .app-title {
      color: ${theme.hex};
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 24px;
    }

    /* This is the box where your message appears */
    .message-box {
      background-color: #f3f4f6;
      border-radius: 12px;
      padding: 20px;
      font-size: 16px;
      color: #374151;
      margin-bottom: 24px;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* This styles your button */
    .tap-button {
      background-color: ${theme.hex};
      color: white;
      font-size: 18px;
      font-weight: bold;
      border: none;
      border-radius: 12px;
      padding: 16px;
      width: 100%;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- This is your app title -->
  <p class="app-title">${appTitle}</p>

  <!-- This box displays the current message -->
  <!-- The id="message" lets JavaScript find and update this element -->
  <div class="message-box" id="message">${messages[0]}</div>

  <!-- This is your button — clicking it runs the showNextMessage function -->
  <button class="tap-button" onclick="showNextMessage()">${buttonLabel}</button>

  <script>
    // These are your three messages stored in an array
    // An array is like a numbered list that JavaScript can read
    var messages = ${messagesAsJS};

    // This variable keeps track of which message we're currently showing
    // We start at 0 because arrays count from 0, not 1
    var currentIndex = 0;

    // This function runs every time the button is clicked
    function showNextMessage() {
      // Move to the next message
      currentIndex = currentIndex + 1;

      // If we've gone past the last message, wrap back to the first one
      // messages.length is 3, so when currentIndex hits 3 we reset to 0
      if (currentIndex >= messages.length) {
        currentIndex = 0;
      }

      // Find the message box element and update its text
      document.getElementById("message").innerText = messages[currentIndex];
    }
  </script>

</body>
</html>`;
}
```

---

## Acceptance Criteria

- [ ] Page loads at `/experience/app/result` after completing the form
- [ ] Navigating directly to `/experience/app/result` redirects to `/select`
- [ ] `AppResultCard` displays the app title, message box, and button
- [ ] The button in `AppResultCard` cycles through the student's three messages on tap
- [ ] After the third message, tapping wraps back to the first message
- [ ] The colored accent stripe at the top of the card matches the student's chosen theme
- [ ] `SeeTheCodePanel` is present (can be a placeholder until that feature is built)
- [ ] `CodeBoxxCTA` is present (can be a placeholder until that feature is built)
- [ ] `generateAppCode` returns a valid HTML string containing the student's actual data
- [ ] The generated `<script>` block includes beginner-friendly plain-English comments
- [ ] The generated messages array in the script reflects the student's actual three messages
- [ ] No console errors or warnings
