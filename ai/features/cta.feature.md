# 📣 FEATURE SPEC — CodeBoxx CTA Component

> **Read `ai-spec.md` first.** This file defines only what is specific to the CodeBoxx CTA.
> The global spec overrides anything here in case of conflict.

---

## Purpose

The CodeBoxx CTA (call-to-action) is the final element on every result screen. It is the moment where the experience converts from "cool thing I just built" to "here's where I can learn to build more." It must be impossible to miss — visible without scrolling on all result screens — and it must link clearly to CodeBoxx Academy.

This component is non-negotiable. Per the global spec, it must appear on every result screen and must not be hidden behind a scroll or a toggle.

---

## Where It Is Used

- `src/app/experience/webpage/result/page.jsx` — replaces the `CodeBoxxCTA` placeholder
- `src/app/experience/app/result/page.jsx` — replaces the `CodeBoxxCTA` placeholder

---

## File

| File | Purpose |
|---|---|
| `src/components/shared/CodeBoxxCTA.jsx` | The CTA block shown at the bottom of every result screen |

---

## Component: `CodeBoxxCTA`

**File:** `src/components/shared/CodeBoxxCTA.jsx`

**Props:** None — content is static

---

## Layout and Content (top to bottom inside the card)

1. **Headline**
   - Text: `"Want to build more?"`
   - Style: bold, large, centered, dark gray
   - Tailwind: `text-xl font-bold text-gray-900 text-center`

2. **Subheadline**
   - Text: `"CodeBoxx Academy teaches full-stack development in 12 weeks. No experience required."`
   - Style: small, centered, muted gray
   - Tailwind: `text-sm text-gray-500 text-center mt-1`

3. **CTA Button**
   - Text: `"Learn More at CodeBoxx →"`
   - Style: full-width, CodeBoxx yellow background, bold black text, large tap target
   - Links to `process.env.NEXT_PUBLIC_CTA_URL` (which resolves to `https://codeboxx.ca`)
   - Opens in a new tab: `target="_blank" rel="noopener noreferrer"`
   - Rendered as an `<a>` tag styled as a button — not a `<Link>` (external URL)
   - Tailwind: `w-full block bg-yellow-400 text-gray-900 font-bold text-base py-4 rounded-2xl text-center mt-4`

4. **Fine print**
   - Text: `"Scan the QR code at our booth to save this link."`
   - Style: very small, centered, very muted
   - Tailwind: `text-xs text-center text-gray-400 mt-3`

---

## Card Wrapper Styling

The CTA block sits inside a styled card to visually separate it from the code panel above:

- Background: `bg-yellow-50`
- Border: `border border-yellow-200`
- Rounded: `rounded-2xl`
- Padding: `p-6`
- Top margin: `mt-2`
- Bottom margin: `mb-8` — ensures the CTA doesn't sit flush against the bottom of the screen

---

## Full File

**`src/components/shared/CodeBoxxCTA.jsx`**
```jsx
// CodeBoxxCTA.jsx — Call-to-action block shown at the bottom of every result screen.
// Links students to CodeBoxx Academy. This component is required on all result screens.

export default function CodeBoxxCTA() {
  return (
    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-2 mb-8">

      {/* Headline */}
      <p className="text-xl font-bold text-gray-900 text-center">
        Want to build more?
      </p>

      {/* Subheadline */}
      <p className="text-sm text-gray-500 text-center mt-1">
        CodeBoxx Academy teaches full-stack development in 12 weeks.
        No experience required.
      </p>

      {/* CTA button — external link, opens in new tab */}
      <a
        href={process.env.NEXT_PUBLIC_CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full block bg-yellow-400 text-gray-900 font-bold text-base py-4 rounded-2xl text-center mt-4"
      >
        Learn More at CodeBoxx →
      </a>

      {/* Fine print */}
      <p className="text-xs text-center text-gray-400 mt-3">
        Scan the QR code at our booth to save this link.
      </p>

    </div>
  );
}
```

---

## Replacing Placeholders on Result Screens

Once this component is built, replace the placeholder divs on both result pages.

### In `src/app/experience/webpage/result/page.jsx`:
```jsx
// Replace this:
<div className="my-4 p-4 bg-yellow-50 rounded-xl text-sm text-gray-700 text-center">CodeBoxx CTA coming soon</div>

// With this:
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
// ...
<CodeBoxxCTA />
```

### In `src/app/experience/app/result/page.jsx`:
```jsx
// Replace this:
<div className="my-4 p-4 bg-yellow-50 rounded-xl text-sm text-gray-700 text-center">CodeBoxx CTA coming soon</div>

// With this:
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
// ...
<CodeBoxxCTA />
```

---

## Acceptance Criteria

- [ ] `CodeBoxxCTA` renders on both result screens without errors
- [ ] The component is visible without scrolling on a 375px-wide viewport (iPhone SE)
- [ ] The headline `"Want to build more?"` is visible and bold
- [ ] The CTA button links to `https://codeboxx.ca` (via `NEXT_PUBLIC_CTA_URL`)
- [ ] The CTA button opens in a new browser tab
- [ ] The button has a large enough tap target for comfortable use on a phone (`py-4`)
- [ ] The fine print `"Scan the QR code at our booth to save this link."` is visible below the button
- [ ] The placeholder divs on both result pages have been replaced with real `CodeBoxxCTA` imports
- [ ] `NEXT_PUBLIC_CTA_URL` is set in `.env.local` and resolves correctly in the browser
- [ ] No console errors or warnings on either result screen
