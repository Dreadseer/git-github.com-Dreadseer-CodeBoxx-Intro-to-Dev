# 🎯 FEATURE SPEC — Experience Selector

> **Read `ai-spec.md` first.** This file defines only what is specific to the Experience Selector screen.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The Experience Selector screen gives students a clear choice between the two available experiences. It should feel exciting and easy — two big, tappable cards, a short description of each, and nothing else to distract them.

---

## Route

| Route | File |
|---|---|
| `/select` | `src/app/select/page.jsx` |

---

## Layout and Content

The selector screen is a single, full-viewport mobile screen. No scrolling should be required.

### Sections (top to bottom):

1. **Step Header**
   - Back arrow (`←`) on the left — navigates back to `/`
   - Title text: `"What do you want to build?"`
   - Tailwind: `text-xl font-bold text-gray-900`
   - The back arrow is a plain `<Link>` styled as a button — no shared component yet

2. **Subheadline**
   - Text: `"Pick one. You can always come back and try the other."`
   - Tailwind: `text-sm text-center text-gray-500 mt-1 mb-8`

3. **Experience Cards** (stacked vertically, full width)
   - Two large tappable cards, one per experience
   - Each card navigates to its respective route on tap
   - Cards are stacked (not side by side) so the descriptions have room to breathe
   - Each card contains:
     - A large emoji icon
     - A bold title
     - A 1–2 sentence description
     - A `"Let's go →"` label at the bottom right in the accent color

   **Card 1 — Build Your First Web Page**
   - Emoji: `🌐`
   - Title: `"Build Your First Web Page"`
   - Description: `"Enter your name, dream job, and a color. We'll build you a personal landing page and show you the code behind it."`
   - Route: `/experience/webpage`
   - Border accent color: `border-violet-400`

   **Card 2 — Build Your First App**
   - Emoji: `📱`
   - Title: `"Build Your First App"`
   - Description: `"Pick a button, write three messages, and we'll build you a working interactive app — then show you how it works."`
   - Route: `/experience/app`
   - Border accent color: `border-blue-400`

4. **Footer Note**
   - Text: `"Both experiences take about 5 minutes."`
   - Tailwind: `text-xs text-center text-gray-400 mt-6`

---

## Card Styling Rules

- Each card is a full-width rounded box with a visible left border in the accent color
- Background: `bg-white`
- Border: `border border-gray-200` with `border-l-4` in the accent color
- Shadow: `shadow-sm`
- Padding: `p-5`
- Border radius: `rounded-2xl`
- The entire card is wrapped in a `<Link>` so the whole surface is tappable
- On tap, the card navigates to its route — no JavaScript needed
- Minimum card height: `160px` so tap targets are large enough on small phones

---

## Navigation

| Action | Destination |
|---|---|
| Tap back arrow | `/` |
| Tap Card 1 | `/experience/webpage` |
| Tap Card 2 | `/experience/app` |

---

## No Context Initialization Here

The Experience Selector does **not** initialize or touch either Context. Contexts are initialized inside the experience pages themselves (`/experience/webpage` and `/experience/app`). This screen is purely presentational.

---

## Component Used

This page uses no shared components from `src/components/shared/` — they are built in a later feature. All layout and styling is written inline in `page.jsx` using Tailwind classes.

---

## Full File

### `src/app/select/page.jsx`

```jsx
// select/page.jsx — Experience Selector screen.
// Students choose between building a web page or a mini app.

import Link from "next/link";

export default function ExperienceSelectorPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-md mx-auto">

      {/* Back arrow + Page title */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/" className="text-gray-500 text-xl font-bold">
          ←
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          What do you want to build?
        </h1>
      </div>

      {/* Subheadline */}
      <p className="text-sm text-gray-500 mt-1 mb-8 pl-9">
        Pick one. You can always come back and try the other.
      </p>

      {/* Experience Cards */}
      <div className="flex flex-col gap-5">

        {/* Card 1 — Web Page */}
        <Link
          href="/experience/webpage"
          className="flex flex-col justify-between min-h-40 bg-white border border-gray-200 border-l-4 border-l-violet-400 rounded-2xl shadow-sm p-5"
        >
          <div>
            <span className="text-4xl">🌐</span>
            <h2 className="text-lg font-bold text-gray-900 mt-2">
              Build Your First Web Page
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your name, dream job, and a color. We'll build you a personal
              landing page and show you the code behind it.
            </p>
          </div>
          <p className="text-sm font-semibold text-violet-500 text-right mt-4">
            Let's go →
          </p>
        </Link>

        {/* Card 2 — Mini App */}
        <Link
          href="/experience/app"
          className="flex flex-col justify-between min-h-40 bg-white border border-gray-200 border-l-4 border-l-blue-400 rounded-2xl shadow-sm p-5"
        >
          <div>
            <span className="text-4xl">📱</span>
            <h2 className="text-lg font-bold text-gray-900 mt-2">
              Build Your First App
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pick a button, write three messages, and we'll build you a working
              interactive app — then show you how it works.
            </p>
          </div>
          <p className="text-sm font-semibold text-blue-500 text-right mt-4">
            Let's go →
          </p>
        </Link>

      </div>

      {/* Footer Note */}
      <p className="text-xs text-center text-gray-400 mt-6">
        Both experiences take about 5 minutes.
      </p>

    </main>
  );
}
```

---

## Acceptance Criteria

- [ ] Page loads at `http://localhost:3000/select` with no errors
- [ ] All content is visible on a 375px-wide viewport without scrolling
- [ ] The back arrow navigates to `/`
- [ ] Tapping Card 1 navigates to `/experience/webpage`
- [ ] Tapping Card 2 navigates to `/experience/app`
- [ ] Each card has a distinct left border accent color (violet for Card 1, blue for Card 2)
- [ ] Each card's entire surface is tappable (the `<Link>` wraps the whole card)
- [ ] Minimum card height is sufficient for comfortable tapping on a real phone
- [ ] No shared components imported — page is fully self-contained
- [ ] No console errors or warnings
