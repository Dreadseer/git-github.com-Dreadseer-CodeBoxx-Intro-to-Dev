# CodeBoxx Intro to Dev

A mobile-first, QR-code-accessible web application built for CodeBoxx Academy high school recruitment events. Students scan a QR code, open the app in their phone's browser, choose an experience, and build either a personal landing page or an interactive mini-app in roughly five minutes — with no login, no installation, and no prior coding knowledge required.

The core value proposition: students see the actual HTML, CSS, and JavaScript they just built, can email it to themselves as a working `.html` file, and walk away feeling like real developers.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [User Flow](#user-flow)
5. [Experience 1 — Web Page Builder](#experience-1--web-page-builder)
6. [Experience 2 — App Builder](#experience-2--app-builder)
7. [Data Layer](#data-layer)
8. [Shared Components](#shared-components)
9. [Context / State Management](#context--state-management)
10. [Code Generation Utilities](#code-generation-utilities)
11. [Email Flow](#email-flow)
12. [Environment Setup](#environment-setup)
13. [Deployment](#deployment)
14. [Known Limitations](#known-limitations)
15. [Redesign Notes](#redesign-notes)

---

## Tech Stack

| Layer | Package | Version | Purpose |
|---|---|---|---|
| Framework | `next` | ^16.2.4 | App Router, server components, API routes, static export |
| UI Library | `react` | ^19.2.5 | Component model and client-side state |
| UI Library | `react-dom` | ^19.2.5 | DOM rendering |
| Email Service | `resend` | ^6.12.2 | Transactional email — sends generated code to students and copies to staff |
| Styling | `tailwindcss` | ^4.2.2 | Utility-first CSS, mobile-first responsive design |
| CSS Processing | `@tailwindcss/postcss` | ^4.2.2 | Tailwind's official PostCSS integration |
| CSS Processing | `postcss` | ^8.5.10 | CSS transformation pipeline |
| CSS Processing | `autoprefixer` | ^10.5.0 | Vendor prefix injection |
| Language | JavaScript (JSX) | ES2020+ | No TypeScript — all files are `.jsx` or `.js` |
| Runtime | Node.js | 20 | Build and server runtime |
| Deployment | Vercel | — | Primary deployment; required for server-side API routes |
| CI/CD | GitHub Actions | — | Secondary static export deploy to GitHub Pages |

---

## Architecture Overview

The app is **fully stateless**. There is no database, no session storage, and no authentication. All form state lives in React Context for the duration of the browser session. Context is scoped to each experience's route segment via a layout-level provider, so the web page builder and app builder have completely independent state trees.

No state is passed via URL parameters. The result pages read directly from the same Context instance that the builder pages wrote to. If a student navigates directly to a result URL without completing the form, a redirect guard sends them back to `/select`.

---

## Project Structure

```
/
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── layout.jsx                          # Root layout: sets <html>, <body>, global metadata
│   │   ├── globals.css                         # Tailwind import, iOS zoom fix, smooth scroll
│   │   ├── page.jsx                            # Landing page (/) — CodeBoxx logo, two experience cards, "Start Building" CTA
│   │   ├── select/
│   │   │   └── page.jsx                        # Experience selector (/select) — two full-width cards linking to each experience
│   │   ├── experience/
│   │   │   ├── webpage/
│   │   │   │   ├── layout.jsx                  # Wraps /experience/webpage/* in <WebPageProvider>
│   │   │   │   ├── page.jsx                    # Web Page Builder form — 3-step form, live preview, widget system, code panel
│   │   │   │   └── result/
│   │   │   │       └── page.jsx                # Web Page result screen — result card, code panel, CTA, email form
│   │   │   └── app/
│   │   │       ├── layout.jsx                  # Wraps /experience/app/* in <AppBuilderProvider>
│   │   │       ├── page.jsx                    # App Builder form — 3-step form, live preview, widget system, code panel
│   │   │       └── result/
│   │   │           └── page.jsx                # App result screen — result card, code panel, CTA, email form
│   │   └── api/
│   │       └── send-code/
│   │           └── route.js                    # POST /api/send-code — validates input, sends email to student + copy to staff via Resend
│   ├── components/
│   │   ├── shared/                             # Used by both experiences
│   │   │   ├── AvatarPicker.jsx                # 4-column emoji grid for picking an avatar icon (Experience 1 only)
│   │   │   ├── CodeBlock.jsx                   # Syntax-highlighted code display with section-level highlight on field change
│   │   │   ├── CodeBoxxCTA.jsx                 # "Want to build more?" yellow card with link to codeboxx.ca; required on all result screens
│   │   │   ├── ColorSwatchPicker.jsx           # Row of circular color swatches drawn from THEME_COLORS; used in both experiences
│   │   │   ├── EmailSubmissionForm.jsx         # Name + email inputs, three opt-in checkboxes, submit button; POSTs to /api/send-code
│   │   │   ├── GhostButton.jsx                 # Secondary action button — transparent with gray border; full width
│   │   │   ├── PageShell.jsx                   # Consistent page wrapper — white bg, max-w-md, horizontal padding, vertical flex
│   │   │   ├── PrimaryButton.jsx               # Main CTA button — yellow background, full width, large tap target; accepts disabled prop
│   │   │   ├── SeeTheCodePanel.jsx             # Expandable panel wrapping CodeBlock; collapsed or open by defaultOpen prop
│   │   │   ├── StepHeader.jsx                  # Back arrow (Link or button) + page title; back target controlled by backHref or onBack prop
│   │   │   ├── StepProgress.jsx                # Dot-based progress indicator; active dot filled black, inactive dots gray
│   │   │   ├── WidgetCanvas.jsx                # Drop target for a single slot (top/after_header/bottom); renders WidgetItem for each placed widget
│   │   │   ├── WidgetEditor.jsx                # Inline editor for the selected widget; shows type-specific fields + slot move buttons
│   │   │   ├── WidgetItem.jsx                  # Single placed widget with a remove (✕) button and tap-to-edit body; yellow ring when selected
│   │   │   ├── WidgetPanel.jsx                 # Horizontal scrolling tray of widget tiles; supports tap (mobile) and drag (desktop)
│   │   │   └── WidgetPlacer.jsx                # Bottom-sheet modal for selecting a placement slot after tapping a widget tile
│   │   ├── webpage/                            # Experience 1 specific
│   │   │   ├── WebPageFormStep1.jsx            # Step 1: name (text) + dreamJob (text); Next disabled until both filled
│   │   │   ├── WebPageFormStep2.jsx            # Step 2: bio (textarea) + themeColor (ColorSwatchPicker); Next disabled until bio filled
│   │   │   ├── WebPageFormStep3.jsx            # Step 3: avatar (AvatarPicker); always enabled — default pre-selected
│   │   │   ├── WebPageLivePreview.jsx          # Phone-frame (280px, 9:16) showing avatar, name, dreamJob, bio, divider; three WidgetCanvas slots
│   │   │   └── WebPageResultCard.jsx           # Full-width card with colored header, avatar, name, dreamJob, bio, widgets; read-only
│   │   └── app/                               # Experience 2 specific
│   │       ├── AppFormStep1.jsx                # Step 1: appTitle (text) + buttonLabel (text); Next disabled until both filled
│   │       ├── AppFormStep2.jsx                # Step 2: three message inputs (text); Next disabled until all three filled
│   │       ├── AppFormStep3.jsx                # Step 3: themeColor (ColorSwatchPicker); always enabled — default pre-selected
│   │       ├── AppLivePreview.jsx              # Phone-frame (280px, 9:16) containing MessageCycler in compact mode + three WidgetCanvas slots
│   │       ├── AppResultCard.jsx               # Full-width card with colored accent stripe, full-size MessageCycler, widget slots; read-only
│   │       └── MessageCycler.jsx               # Interactive button + message box; tap cycles through the three messages; compact prop for phone frame
│   ├── context/
│   │   ├── WebPageContext.jsx                  # Form state for Experience 1; exposes formData + updateField, addWidget, removeWidget, updateWidget, moveWidget
│   │   └── AppBuilderContext.jsx               # Form state for Experience 2; exposes formData + updateField, updateMessage, addWidget, removeWidget, updateWidget, moveWidget
│   ├── data/
│   │   ├── avatars.js                          # AVATAR_OPTIONS array + DEFAULT_AVATAR constant
│   │   ├── themes.js                           # THEME_COLORS object + DEFAULT_THEME constant
│   │   └── widgets.js                          # WIDGET_TYPES array defining all available widget types
│   └── utils/
│       ├── generateWebPageCode.js              # Accepts formData, returns complete HTML string for Experience 1
│       ├── generateAppCode.js                  # Accepts formData, returns complete HTML + JS string for Experience 2
│       └── getHighlightKey.js                  # Maps formData.lastChanged to comment markers in generated code for CodeBlock highlighting
├── public/
│   └── codeboxx-logo.png                       # CodeBoxx logo shown on the landing page
├── .github/
│   └── workflows/
│       └── deploy.yml                          # GitHub Actions: build static export → deploy to GitHub Pages on push to main
├── .vercel/
│   └── project.json                            # Vercel project ID and org ID (committed for CI integration)
├── jsconfig.json                               # Path alias: @/* → ./src/*
├── next.config.js                              # Minimal Next.js config (empty nextConfig object)
├── postcss.config.js                           # PostCSS config: @tailwindcss/postcss plugin
└── package.json                                # Dependencies and npm scripts
```

---

## User Flow

```
QR Code Scan (event booth)
         │
         ▼
  Landing Page  /
  ─────────────────────────────────────────────────────
  CodeBoxx logo, headline, two experience preview cards,
  "Takes about 5 minutes" badge, "Start Building →" link
         │
         ▼
  Experience Selector  /select
  ─────────────────────────────────────────────────────
  Two full-width tappable cards

         ├─────────────────────────────────────────────►
         │                                             │
         ▼                                             ▼
  Web Page Builder                            App Builder
  /experience/webpage                         /experience/app
  ─────────────────────                       ─────────────────────
  Step 1: name + dreamJob                     Step 1: appTitle + buttonLabel
  Step 2: bio + themeColor                    Step 2: three messages
  Step 3: avatar                              Step 3: themeColor
  ── widget panel available on all steps ──
  ── live preview updates on every keystroke ──
  ── SeeTheCodePanel open by default ──
         │                                             │
         ▼                                             ▼
  Result Screen                               Result Screen
  /experience/webpage/result                  /experience/app/result
  ─────────────────────                       ─────────────────────
  WebPageResultCard (read-only)               AppResultCard (interactive)
  SeeTheCodePanel (collapsed)                 SeeTheCodePanel (collapsed)
  CodeBoxxCTA                                 CodeBoxxCTA
  EmailSubmissionForm                         EmailSubmissionForm
```

**State handoff between builder and result:** Both the builder page and result page live under the same route segment (`/experience/webpage/*` or `/experience/app/*`), which is wrapped by a shared layout that mounts the Context Provider. The result page calls `useWebPage()` / `useAppBuilder()` directly — no URL params, no localStorage, no serialization. If the student hard-refreshes the result page, Context resets to defaults and the redirect guard sends them back to `/select`.

---

## Experience 1 — Web Page Builder

### Form Steps

| Step | Title | Fields | Next enabled when |
|---|---|---|---|
| 1 | Tell us about you | `name` (text), `dreamJob` (text) | Both fields non-empty |
| 2 | Pick your style | `bio` (textarea), `themeColor` (color picker) | `bio` non-empty |
| 3 | Choose your icon | `avatar` (emoji picker) | Always (default pre-selected) |

### Widget System

On all three steps, a horizontal **WidgetPanel** tray is visible below the form. Students can tap a widget tile (mobile) or drag it (desktop) onto the **WebPageLivePreview**. When tapped, a **WidgetPlacer** bottom-sheet asks which slot to use. Widgets can be edited in-place via **WidgetEditor** (tap the placed widget) and moved between slots.

### Live Preview

**WebPageLivePreview** renders a 280px-wide, 9:16 aspect-ratio phone frame showing:
- `top` slot (WidgetCanvas)
- Colored header bar with avatar emoji (driven by `themeColor` and `avatar`)
- `after_header` slot (WidgetCanvas)
- Student name (colored with theme), dream job (gray), divider line, bio
- `bottom` slot (WidgetCanvas)
- "Made with CodeBoxx" footer

All fields display placeholder text until the student types.

### Code Panel

**SeeTheCodePanel** is open by default (`defaultOpen={true}`) on the builder page. It wraps **CodeBlock**, which highlights the section of the generated HTML corresponding to the last-changed field — driven by `formData.lastChanged` → `getHighlightKey()` → comment markers in the generated output.

### Result Screen

Renders **WebPageResultCard** (full-width, read-only version of the preview), the code panel (collapsed by default), **CodeBoxxCTA**, and **EmailSubmissionForm**.

Guard: if `formData.name` is falsy on mount, `redirect("/select")` fires.

---

## Experience 2 — App Builder

### Form Steps

| Step | Title | Fields | Next enabled when |
|---|---|---|---|
| 1 | Name your app | `appTitle` (text), `buttonLabel` (text) | Both fields non-empty |
| 2 | Write your messages | `messages[0]`, `messages[1]`, `messages[2]` (text) | All three non-empty |
| 3 | Pick your style | `themeColor` (color picker) | Always (default pre-selected) |

### Widget System

Identical to Experience 1. The three placement slots (`top`, `after_header`, `bottom`) render inside **AppLivePreview** around the **MessageCycler**.

### Live Preview

**AppLivePreview** renders the same phone frame containing:
- `top` slot
- `after_header` slot
- **MessageCycler** (compact mode) — shows the app title, a message display box, and the tap button; fully interactive even during form editing
- `bottom` slot

### MessageCycler

A self-contained interactive component. On each button tap, `currentIndex` increments and wraps at `messages.length`. Used in both the phone-frame preview (`compact={true}`, smaller text and padding) and the result card (`compact={false}`, full-size).

### Result Screen

Renders **AppResultCard** (full-width card with a colored accent stripe and a full-size **MessageCycler**), the code panel, **CodeBoxxCTA**, and **EmailSubmissionForm**.

Guard: if `formData.appTitle` is falsy on mount, `redirect("/select")` fires.

---

## Data Layer

### `src/data/themes.js`

Exports `THEME_COLORS` (object) and `DEFAULT_THEME` (string: `"purple"`).

| Key | Label | Hex | Text |
|---|---|---|---|
| `purple` | Purple | `#7C3AED` | `#ffffff` |
| `blue` | Blue | `#2563EB` | `#ffffff` |
| `teal` | Teal | `#0D9488` | `#ffffff` |
| `orange` | Orange | `#EA580C` | `#ffffff` |
| `pink` | Pink | `#DB2777` | `#ffffff` |
| `slate` | Slate | `#475569` | `#ffffff` |

Each entry defines a `hex` (used for backgrounds and accent colors) and a `text` color (always white). The `label` is used as `aria-label` on swatch buttons.

### `src/data/avatars.js`

Exports `AVATAR_OPTIONS` (array) and `DEFAULT_AVATAR` (string: `"rocket"`). Avatars are emoji only — no image files required.

| Key | Emoji | Label |
|---|---|---|
| `rocket` | 🚀 | Rocket |
| `lightning` | ⚡ | Lightning |
| `star` | ⭐ | Star |
| `fire` | 🔥 | Fire |
| `diamond` | 💎 | Diamond |
| `robot` | 🤖 | Robot |
| `brain` | 🧠 | Brain |
| `gamepad` | 🎮 | Gamepad |

### `src/data/widgets.js`

Exports `WIDGET_TYPES` (array). Each entry defines a `key`, `label`, `icon` (emoji), and `defaults` (the initial `values` object when the widget is added).

| Key | Label | Icon | Configurable Fields |
|---|---|---|---|
| `heading` | Text / Heading | 📝 | `text` (string) |
| `button` | Button | 🔘 | `label` (string), `url` (string, optional) |
| `contact` | Contact Form | 📬 | None — static Name/Email/Message fields |
| `message_box` | Message Box | 💬 | `text` (string) |
| `social` | Social Links | 🔗 | `github`, `instagram`, `linkedin` (URL strings) |

Widgets support three placement slots: `top` (above all content), `after_header` (below the colored bar or app title), and `bottom` (below all content).

---

## Shared Components

| Component | Renders / Handles | Used By |
|---|---|---|
| `AvatarPicker` | 4×2 grid of emoji avatar buttons; selected item gets yellow highlight | `WebPageFormStep3` |
| `CodeBlock` | Dark-theme code display with line-level section highlighting; non-scrolling on Y axis up to 400px | `SeeTheCodePanel` |
| `CodeBoxxCTA` | Yellow card: "Want to build more?" + link to `NEXT_PUBLIC_CTA_URL` | Both result screens |
| `ColorSwatchPicker` | Row of circular color swatches from `THEME_COLORS`; selected item gets a ring | `WebPageFormStep2`, `AppFormStep3` |
| `EmailSubmissionForm` | Name + email inputs, three opt-in checkboxes, submit button; POSTs to `/api/send-code`; shows success/error states | Both result screens |
| `GhostButton` | Transparent full-width button with gray border | Available but not currently wired in result screens |
| `PageShell` | `<main>` wrapper: white bg, `max-w-md`, centered, horizontal padding, full-height flex column | All experience pages |
| `PrimaryButton` | Yellow `bg-yellow-400` full-width button; `disabled` prop fades it and blocks clicks | All form steps, `EmailSubmissionForm` |
| `SeeTheCodePanel` | Toggle button + collapsible `CodeBlock` panel; `defaultOpen` controls initial state | Both builder pages (open), both result screens (closed) |
| `StepHeader` | Back arrow (renders as `<Link>` if `backHref` provided, `<button>` if `onBack` provided) + `<h1>` title | All experience pages |
| `StepProgress` | Row of dots; current step dot filled `bg-gray-900`, others `bg-gray-300` | Both builder pages |
| `WidgetCanvas` | Drop zone for one slot; renders `WidgetItem` for each assigned widget; shows dashed "Drop here" hint when empty | Both live previews |
| `WidgetEditor` | Inline panel with type-specific input fields + slot move buttons; renders nothing if `widget` is null | Both builder pages |
| `WidgetItem` | Card with ✕ remove button and tap-to-edit body; yellow ring when `isSelected` | `WidgetCanvas` |
| `WidgetPanel` | Horizontally scrolling row of widget tiles; supports `draggable` + `onClick` | Both builder pages |
| `WidgetPlacer` | Fixed bottom sheet with slot options + dark overlay; fires `onConfirm(widgetKey, slot)` | Both builder pages |

---

## Context / State Management

### `WebPageContext` — Experience 1

**Provider:** `WebPageProvider`, mounted by `src/app/experience/webpage/layout.jsx`. Covers both the builder page and the result page.

**Custom hook:** `useWebPage()` — throws if used outside the provider.

**State shape:**

```js
{
  name: "",          // Student's name — displayed on page and used as email recipient label
  dreamJob: "",      // Dream job title shown below the name
  bio: "",           // Short bio paragraph
  themeColor: "purple",  // Key from THEME_COLORS; drives colors throughout preview and generated code
  avatar: "rocket",      // Key from AVATAR_OPTIONS; drives emoji in header
  widgets: [],           // Array of widget instances: { id, type, position, values }
  lastChanged: null,     // String (field key) or object ({ kind: "widget", widgetType, slot }); drives code highlighting
}
```

**Exposed actions:**

| Action | Signature | Effect |
|---|---|---|
| `updateField` | `(key, value)` | Updates one top-level field; sets `lastChanged` to the field key |
| `addWidget` | `(type, position)` | Creates a new widget instance with `id: widget_${Date.now()}` and default values |
| `removeWidget` | `(id)` | Filters the widget out of the array |
| `updateWidget` | `(id, key, value)` | Updates one value on a specific widget instance; sets `lastChanged` to widget descriptor |
| `moveWidget` | `(id, newPosition)` | Changes the `position` of a widget instance |

**Consumers:** `WebPageFormStep1`, `WebPageFormStep2`, `WebPageFormStep3`, `WebPageLivePreview`, `WebPageResultCard`, both builder and result pages.

---

### `AppBuilderContext` — Experience 2

**Provider:** `AppBuilderProvider`, mounted by `src/app/experience/app/layout.jsx`.

**Custom hook:** `useAppBuilder()` — throws if used outside the provider.

**State shape:**

```js
{
  appTitle: "",          // App name — displayed as the heading in MessageCycler
  buttonLabel: "",       // Text on the tap button in MessageCycler
  messages: ["", "", ""], // Array of three strings cycled by the button
  themeColor: "purple",  // Key from THEME_COLORS
  widgets: [],           // Same structure as WebPageContext
  lastChanged: null,     // Same structure as WebPageContext
}
```

**Exposed actions:**

Same as `WebPageContext` plus:

| Action | Signature | Effect |
|---|---|---|
| `updateMessage` | `(index, value)` | Updates `messages[index]`; sets `lastChanged` to `"messages"` |

**Consumers:** `AppFormStep1`, `AppFormStep2`, `AppFormStep3`, `AppLivePreview`, `AppResultCard`, `MessageCycler`, both builder and result pages.

---

## Code Generation Utilities

### `generateWebPageCode(formData)`

**Input:** `{ name, dreamJob, bio, themeColor, avatar, widgets }`

**Output:** A complete standalone `<!DOCTYPE html>` string with inline `<style>` and no external dependencies.

**Structure of generated output:**

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" ... />
  <title>{name}'s Page</title>
  <style>
    /* body, .header, .name, .job, .divider, .bio, .footer */
    /* theme hex color used in: .header background, .name color, .divider background */
  </style>
</head>
<body>
  <!-- Top widgets (if any) -->
  <div class="header">{avatarEmoji}</div>
  <!-- After header widgets (if any) -->
  <p class="name">{name}</p>
  <p class="job">{dreamJob}</p>
  <div class="divider"></div>
  <p class="bio">{bio}</p>
  <!-- Bottom widgets (if any) -->
  <p class="footer">Made with CodeBoxx</p>
</body>
</html>
```

Every meaningful line has an inline HTML comment explaining what it does (intentional — these are teaching aids for students). Widget slots are only emitted if the student placed widgets there.

Widget HTML output per type:
- `heading` → `<h2>` with inline style
- `button` → `<a>` with inline style; `href` omitted if URL is empty
- `contact` → `<form>` with three `<input>` / `<textarea>` fields (purely visual, not functional)
- `message_box` → `<div>` with blue background
- `social` → `<div>` of pill `<a>` links; only platforms with non-empty URLs are rendered

---

### `generateAppCode(formData)`

**Input:** `{ appTitle, buttonLabel, messages, themeColor, widgets }`

**Output:** A complete standalone `<!DOCTYPE html>` string with inline `<style>` and a `<script>` block.

**Structure of generated output:**

```
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    /* body, .app-title, .message-box, .tap-button */
    /* theme hex color used in: .app-title color, .tap-button background */
  </style>
</head>
<body>
  <!-- Top widgets (if any) -->
  <p class="app-title">{appTitle}</p>
  <!-- After header widgets (if any) -->
  <div class="message-box" id="message">{messages[0]}</div>
  <button class="tap-button" onclick="showNextMessage()">{buttonLabel}</button>
  <script>
    var messages = ["msg1", "msg2", "msg3"]; // JSON.stringify of student's messages array
    var currentIndex = 0;
    function showNextMessage() {
      currentIndex = currentIndex + 1;
      if (currentIndex >= messages.length) { currentIndex = 0; }
      document.getElementById("message").innerText = messages[currentIndex];
    }
  </script>
  <!-- Bottom widgets (if any) -->
  <p style="...">Made with CodeBoxx</p>
</body>
</html>
```

The `<script>` block is heavily commented with beginner-friendly explanations (arrays, zero-indexing, `getElementById`) — intentional teaching aids.

---

### `getHighlightKey(lastChanged, experience)`

**Input:** `lastChanged` from Context state + `"webpage"` or `"app"`.

**Output:** `null` | `string` | `string[]`

Maps `lastChanged` to the comment text strings used as markers in the generated HTML. `CodeBlock` uses these strings to find matching lines and highlight the surrounding section with a yellow background.

- Plain field change (e.g. `"name"`) → returns a single string marker
- Widget change (`{ kind: "widget", widgetType, slot }`) → returns an array: `[slotMarker, typeMarker]`
- Null → returns null (no highlight)

---

## Email Flow

### Endpoint: `POST /api/send-code`

**Request body (JSON):**

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "experience": "webpage",
  "generatedCode": "<!DOCTYPE html>...",
  "optInRecruitment": true,
  "optInSchoolInfo": false,
  "acknowledgeDataRetention": true
}
```

**Validation:** Returns `400` if `name`, `email`, or `generatedCode` is missing.

**Behavior:**

1. Sends an email to the student's address with:
   - Subject: `Your CodeBoxx {experienceLabel} — built by {name}`
   - Body: greeting, instructions, a `<pre>`-formatted code block (HTML-escaped), link to codeboxx.ca
   - Attachment: the `.html` file as a base64-encoded string (`my-codeboxx-webpage.html` or `my-codeboxx-app.html`)

2. Sends a copy to `RESEND_TO_COPY` with:
   - Subject: `[CodeBoxx Event] New submission from {name}`
   - Body: name, email, experience type, all three opt-in checkbox values

**Returns:** `{ success: true }` on success, `{ error: "..." }` with status `400` or `500` on failure.

### Environment Variables Required

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) — required for any email to send |
| `RESEND_FROM_EMAIL` | Sender address; must be a verified domain or Resend's `onboarding@resend.dev` |
| `RESEND_TO_COPY` | Internal address that receives a copy of every student submission |

Additional public variables (used at build time in GitHub Actions):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CTA_URL` | URL linked from the `CodeBoxxCTA` button |
| `NEXT_PUBLIC_SITE_URL` | Deployed URL for static export mode |

---

## Environment Setup

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/Dreadseer/CodeBoxx-Intro-to-Dev.git
cd CodeBoxx-Intro-to-Dev
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=you@yourdomain.com
RESEND_TO_COPY=staff@codeboxx.ca
NEXT_PUBLIC_CTA_URL=https://codeboxx.ca
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app is optimized for mobile viewports — use browser DevTools device emulation for an accurate preview.

### Production Build

```bash
npm run build
npm start
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with hot module replacement |
| `npm run build` | Production build (outputs to `.next/` for Vercel, or `out/` if static export is configured) |
| `npm start` | Production server from `.next/` build |

---

## Deployment

### Vercel (Primary)

Vercel is the primary deployment target. The app requires the Vercel server runtime because `POST /api/send-code` is a Next.js API route that calls the Resend SDK — it cannot run in a purely static export.

Deployments trigger automatically on push to `main` via Vercel's GitHub integration. Project metadata is committed in `.vercel/project.json`.

Set the following environment variables in the Vercel dashboard:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_COPY`
- `NEXT_PUBLIC_CTA_URL`

### GitHub Pages (Secondary — Static Export)

The workflow at `.github/workflows/deploy.yml` runs on push to `main`:

1. Checks out the repo (`actions/checkout@v4`)
2. Sets up Node.js 20 with npm cache (`actions/setup-node@v4`)
3. Runs `npm ci`
4. Runs `npm run build` with `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CTA_URL` injected as environment variables
5. Uploads the `./out` directory as a Pages artifact
6. Deploys to GitHub Pages (`actions/deploy-pages@v4`)

**Important:** In static export mode, the `/api/send-code` route does not exist. The `EmailSubmissionForm` will receive a network error and show its error state. All other functionality (builder, preview, code generation, result screen) works without a server.

---

## Known Limitations

- **No persistence.** Closing or refreshing the browser clears all form state. Students who navigate away mid-build must start over.
- **No authentication.** The app is intentionally open — anyone with the URL can access all routes.
- **Static export disables email.** Deploying via GitHub Pages means `POST /api/send-code` does not exist. Students see an error when trying to email themselves their code.
- **Email not functional without Resend credentials.** Running locally or on a deployment without `RESEND_API_KEY` set will cause all email sends to fail with a 500 error.
- **No test suite.** There are no unit, integration, or end-to-end tests in the repository.
- **Widget contact form is visual only.** The generated HTML contact form has no form action or submission logic — it renders the fields but cannot send messages.
- **Widgets are unsortable within a slot.** Multiple widgets in the same slot render in insertion order with no drag-to-reorder within the slot.
- **`next.config.js` is empty.** There is no `output: "export"` set in config — the static export relies on the Next.js default behavior triggered by the GitHub Actions environment. Local `npm run build` will produce a `.next/` server build, not a static `out/`.

---

## Redesign Notes

_To be completed. This section will capture redesign decisions and updated architecture._
