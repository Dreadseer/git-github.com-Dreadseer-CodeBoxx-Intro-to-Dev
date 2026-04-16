# 🏠 FEATURE SPEC — Landing / Entry Screen

> **Read `ai-spec.md` first.** This file defines only what is specific to the landing screen.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The landing screen is the first thing a student sees after scanning the QR code. It has one job: make a strong first impression and get the student to tap "Start Building" within seconds. It is not a form, not a menu — it is a hook.

---

## Route

| Route | File |
|---|---|
| `/` | `src/app/page.jsx` |

---

## Layout and Content

The landing screen is a single, full-viewport mobile screen. No scrolling should be required to see all content and the CTA button.

### Sections (top to bottom):

1. **CodeBoxx Logo**
   - Displays `public/codeboxx-logo.png`
   - Centered horizontally
   - Max width: `120px`
   - Top padding: `48px`

2. **Headline**
   - Text: `"Build something real."`
   - Style: large, bold, centered
   - Tailwind: `text-3xl font-bold text-center text-gray-900`

3. **Subheadline**
   - Text: `"No experience needed. No download. Just you and your phone."`
   - Style: medium, centered, muted color
   - Tailwind: `text-base text-center text-gray-500 mt-2`

4. **Experience Preview Cards** (two side-by-side cards)
   - Card 1 — **🌐 Web Page**: `"Build your own personal landing page"`
   - Card 2 — **📱 Mini App**: `"Build a simple interactive app"`
   - Each card is a rounded box with an emoji, short label, and one-line description
   - Cards are equal width, side by side, with a small gap
   - Cards are **non-interactive** on this screen — they are preview only, not buttons
   - Tailwind: `rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center`

5. **Time Estimate Badge**
   - Text: `"⏱ Takes about 5 minutes"`
   - Style: small pill badge, centered
   - Tailwind: `inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full`

6. **Start Button**
   - Text: `"Start Building →"`
   - Style: full-width, large, bold, CodeBoxx yellow background, black text
   - Tailwind: `w-full bg-yellow-400 text-gray-900 font-bold text-lg py-4 rounded-2xl`
   - On tap: navigates to `/select`
   - This is the only interactive element on the screen

7. **Footer Note**
   - Text: `"Powered by CodeBoxx Academy"`
   - Style: small, centered, very muted
   - Tailwind: `text-xs text-center text-gray-400 mt-4`

---

## Navigation

- Tapping **"Start Building →"** navigates to `/select` using Next.js `<Link>` (not `useRouter` — no JS needed for a simple link)
- There is no back navigation on this screen — it is the entry point

---

## Component Used

This page uses no shared components from `src/components/shared/` yet — they are built in a later feature. All layout and styling is written inline in `page.jsx` using Tailwind classes for this screen only.

> **Note:** Once the `PrimaryButton` and `PageShell` shared components are built in the Shared Components feature, they do NOT need to be retrofitted into this page unless noted. Keep this page simple and self-contained.

---

## Full File

### `src/app/page.jsx`

```jsx
// page.jsx — Landing screen. The first screen students see after scanning the QR code.
// Goal: make a strong impression and get them to tap "Start Building" fast.

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 py-12 max-w-md mx-auto">

      {/* CodeBoxx Logo */}
      <Image
        src="/codeboxx-logo.png"
        alt="CodeBoxx Logo"
        width={120}
        height={120}
        className="mb-8"
      />

      {/* Headline */}
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Build something real.
      </h1>

      {/* Subheadline */}
      <p className="text-base text-center text-gray-500 mt-2 mb-8">
        No experience needed. No download. Just you and your phone.
      </p>

      {/* Experience Preview Cards */}
      <div className="flex gap-3 w-full mb-6">

        {/* Card 1 — Web Page */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
          <span className="text-3xl">🌐</span>
          <p className="font-semibold text-gray-800 text-sm mt-2">Web Page</p>
          <p className="text-xs text-gray-500 mt-1">Build your own personal landing page</p>
        </div>

        {/* Card 2 — Mini App */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
          <span className="text-3xl">📱</span>
          <p className="font-semibold text-gray-800 text-sm mt-2">Mini App</p>
          <p className="text-xs text-gray-500 mt-1">Build a simple interactive app</p>
        </div>

      </div>

      {/* Time Estimate Badge */}
      <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-8">
        ⏱ Takes about 5 minutes
      </span>

      {/* Start Button */}
      <Link
        href="/select"
        className="w-full bg-yellow-400 text-gray-900 font-bold text-lg py-4 rounded-2xl text-center block"
      >
        Start Building →
      </Link>

      {/* Footer Note */}
      <p className="text-xs text-center text-gray-400 mt-6">
        Powered by CodeBoxx Academy
      </p>

    </main>
  );
}
```

---

## Acceptance Criteria

- [ ] Page loads at `http://localhost:3000` with no errors
- [ ] All content is visible on a 375px-wide viewport without scrolling
- [ ] The CodeBoxx logo renders from `public/codeboxx-logo.png`
- [ ] Both experience preview cards are side by side and equal width
- [ ] The time estimate badge is styled as a yellow pill
- [ ] The "Start Building →" button navigates to `/select` on tap
- [ ] No interactive behavior other than the Start button
- [ ] No console errors or warnings
- [ ] Tapping the button on a real phone feels responsive (no delay, large tap target)
- [ ] Footer note is visible at the bottom without scrolling on iPhone SE (375px)
