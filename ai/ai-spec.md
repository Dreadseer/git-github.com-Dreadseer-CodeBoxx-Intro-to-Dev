# 🤖 AI_SPEC — CodeBoxx Event Experience

> **READ THIS FILE FIRST before implementing any feature.**
> Every feature specification document must be used in conjunction with this global spec.
> If any rule in a feature spec conflicts with this document, this document wins.

---

## Project Identity

- **Project Name:** CodeBoxx Event Experience
- **Short Description:** A mobile-first, QR-code-accessible web app that lets high school students build either a personal landing page or a simple interactive app directly from their phone — no login, no install, completed in ~5 minutes.
- **Project Type:** Next.js Frontend Application (no backend database required for MVP)
- **Client:** CodeBoxx Academy (internal recruitment/outreach tool)
- **Repository Name:** `codeboxx-event-experience`

---

## Goal and Scope

### Goal

Replace passive tchotchke giveaways at high school events with an interactive, phone-based experience that makes students feel like real creators. The app is accessed via QR code, runs entirely in the browser, and guides students through building something they can see — and understand — in about 5 minutes.

### In Scope (Build Now)

- QR-code-accessible entry point (the root `/` route)
- Experience selection screen (choose between two experiences)
- **Experience 1 — Build Your First Web Page:** guided form, live preview, final result with "See the Code" section
- **Experience 2 — Build Your First App:** guided form, live preview of an interactive button-cycling app, final result with "See the Code" section
- Live preview panels that update in real time as the user types
- Theme color picker (predefined swatches — no free-form hex input)
- Optional avatar/icon selection (Experience 1 only)
- Final result screen with simplified, beginner-readable HTML/CSS/JS code reveal
- CodeBoxx call-to-action (CTA) displayed prominently on every final result screen
- Mobile-first, touch-friendly layout throughout
- Reusable shared component library (buttons, steppers, previews, CTA)

### Out of Scope (Do NOT Build)

- User accounts, login, or sessions of any kind
- Database or persistent storage (no saving user creations between visits)
- Sharing or exporting created pages/apps (future feature)
- Analytics or event dashboards (future feature)
- Free-form CSS or code editing by the user
- File uploads or camera access
- Real-time collaboration
- More than two experiences in this MVP
- Paid or gated content
- Backend API server

---

## Users and Use Cases

- **High School Student at Event** — scans QR code, picks an experience, fills in a short form, sees a live preview of their creation, views their "See the Code" reveal, and is shown the CodeBoxx CTA. No account required.
- **CodeBoxx Staff** — shares the QR code at events. No admin interface required for MVP.

---

## Feature Index

Each feature below has its own AI feature specification file. Read the relevant file alongside this global spec when implementing that feature.

| Feature | File |
|---|---|
| Project Configuration & Setup | `./ai/features/configuration.feature.md` |
| Landing / Entry Screen | `./ai/features/landing.feature.md` |
| Experience Selector | `./ai/features/experience-selector.feature.md` |
| Experience 1 — Web Page Builder (Form) | `./ai/features/exp1-form.feature.md` |
| Experience 1 — Live Preview | `./ai/features/exp1-preview.feature.md` |
| Experience 1 — Result Screen | `./ai/features/exp1-result.feature.md` |
| Experience 2 — App Builder (Form) | `./ai/features/exp2-form.feature.md` |
| Experience 2 — Live Preview | `./ai/features/exp2-preview.feature.md` |
| Experience 2 — Result Screen | `./ai/features/exp2-result.feature.md` |
| See the Code Panel | `./ai/features/see-the-code.feature.md` |
| CodeBoxx CTA Component | `./ai/features/cta.feature.md` |
| Theme & Design System | `./ai/features/design-system.feature.md` |

---

## Pages / Screens / Routes

### Next.js App Router Routes

| Route | Page Component | Auth Required | Notes |
|---|---|---|---|
| `/` | `LandingPage` | No | Entry point — shown when QR code is scanned |
| `/select` | `ExperienceSelectorPage` | No | Choose Experience 1 or 2 |
| `/experience/webpage` | `WebPageBuilderPage` | No | Multi-step form + live preview for Experience 1 |
| `/experience/webpage/result` | `WebPageResultPage` | No | Final result, code reveal, CTA |
| `/experience/app` | `AppBuilderPage` | No | Multi-step form + live preview for Experience 2 |
| `/experience/app/result` | `AppResultPage` | No | Final result, code reveal, CTA |

- No route requires authentication.
- Navigating directly to a result page without form state should redirect to `/select`.
- All routes are stateless; state is passed via React Context or URL-safe query params between form and result screens.

---

## State Structure

State is managed with **React Context + `useState`** only. No Redux. No external state library.

### `WebPageContext`

```js
{
  name: "",           // Student's name
  dreamJob: "",       // e.g. "Game Developer"
  bio: "",            // Short sentence about themselves
  themeColor: "",     // Key from THEME_COLORS (e.g. "purple")
  avatar: ""          // Key from AVATAR_OPTIONS (e.g. "rocket") — optional
}
```

### `AppBuilderContext`

```js
{
  appTitle: "",           // Name of their mini app
  buttonLabel: "",        // e.g. "Tap Me"
  messages: ["", "", ""], // Three short messages to cycle through
  themeColor: ""          // Key from THEME_COLORS
}
```

> **Rule:** Context values are set by the form steps and consumed by the live preview and result screen. Neither context persists to localStorage or any external storage.

---

## Component List

### Shared / Layout Components

| Component | Purpose |
|---|---|
| `PageShell` | Wraps every page — handles max-width, padding, scroll, and background |
| `StepHeader` | Displays step number, title, and back arrow |
| `StepProgress` | Visual step indicator (dots or bar) |
| `PrimaryButton` | Main CTA button — consistent style |
| `GhostButton` | Secondary/back navigation button |
| `ColorSwatchPicker` | Row of tappable color swatches |
| `AvatarPicker` | Grid of icon options (Experience 1 only) |
| `CodeBoxxCTA` | Final screen CTA block — logo, headline, link/QR to codeboxx.ca |
| `SeeTheCodePanel` | Expandable/collapsible panel showing formatted HTML/CSS/JS |
| `CodeBlock` | Displays a single language block with syntax highlighting |

### Experience 1 — Web Page Builder

| Component | Purpose |
|---|---|
| `WebPageFormStep1` | Name + dream job inputs |
| `WebPageFormStep2` | Bio input + color swatch picker |
| `WebPageFormStep3` | Avatar/icon picker (optional) |
| `WebPageLivePreview` | Renders a phone-frame preview of the personal landing page |
| `WebPageResultCard` | The final "your page" card shown on the result screen |

### Experience 2 — App Builder

| Component | Purpose |
|---|---|
| `AppFormStep1` | App title + button label inputs |
| `AppFormStep2` | Three message inputs |
| `AppFormStep3` | Color swatch picker |
| `AppLivePreview` | Renders a phone-frame preview of the interactive cycling-message app |
| `AppResultCard` | The final "your app" card shown on the result screen |
| `MessageCycler` | The actual interactive button + message display used inside the preview and result |

---

## Sample Theme Data

Themes are predefined. Users choose from swatches — they do not enter hex codes. All themes must pass WCAG AA contrast on white backgrounds.

```js
// src/data/themes.js
export const THEME_COLORS = {
  purple:  { label: "Purple",  hex: "#7C3AED", text: "#ffffff" },
  blue:    { label: "Blue",    hex: "#2563EB", text: "#ffffff" },
  teal:    { label: "Teal",    hex: "#0D9488", text: "#ffffff" },
  orange:  { label: "Orange",  hex: "#EA580C", text: "#ffffff" },
  pink:    { label: "Pink",    hex: "#DB2777", text: "#ffffff" },
  slate:   { label: "Slate",   hex: "#475569", text: "#ffffff" },
};

export const DEFAULT_THEME = "purple";
```

### Sample Avatar Data (Experience 1)

```js
// src/data/avatars.js
export const AVATAR_OPTIONS = [
  { key: "rocket",    emoji: "🚀", label: "Rocket"    },
  { key: "lightning", emoji: "⚡", label: "Lightning" },
  { key: "star",      emoji: "⭐", label: "Star"      },
  { key: "fire",      emoji: "🔥", label: "Fire"      },
  { key: "diamond",   emoji: "💎", label: "Diamond"   },
  { key: "robot",     emoji: "🤖", label: "Robot"     },
  { key: "brain",     emoji: "🧠", label: "Brain"     },
  { key: "gamepad",   emoji: "🎮", label: "Gamepad"   },
];
```

---

## "See the Code" Logic

The code revealed on the result screen is **generated dynamically** from the user's form inputs. It is not pulled from a file — it is a template string built in a utility function.

### Experience 1 — Generated HTML

```js
// src/utils/generateWebPageCode.js
// Builds a complete HTML string from the user's WebPageContext values
export function generateWebPageCode({ name, dreamJob, bio, themeColor, avatar }) { ... }
```

The generated output must include:
- Inline `<style>` block with the user's theme color applied
- A visible `<h1>` with the user's name
- A `<p>` for dream job and bio
- The chosen avatar emoji
- Comments explaining each section in plain language (e.g. `<!-- This sets your page's color -->`)

### Experience 2 — Generated JS

```js
// src/utils/generateAppCode.js
// Builds a complete HTML + JS string from the user's AppBuilderContext values
export function generateAppCode({ appTitle, buttonLabel, messages, themeColor }) { ... }
```

The generated output must include:
- Inline `<style>` block with the user's theme color applied
- A `<button>` element using the user's `buttonLabel`
- A `<p>` element where messages are cycled
- A `<script>` block with a simple counter variable and click handler
- Comments explaining what the JavaScript is doing

---

## Folder Structure

```
codeboxx-event-experience/
│
├── src/
│   ├── app/                          ← Next.js App Router pages
│   │   ├── page.jsx                  ← Landing screen (/)
│   │   ├── select/
│   │   │   └── page.jsx              ← Experience selector (/select)
│   │   ├── experience/
│   │   │   ├── webpage/
│   │   │   │   ├── page.jsx          ← Web page builder form (/experience/webpage)
│   │   │   │   └── result/
│   │   │   │       └── page.jsx      ← Web page result screen
│   │   │   └── app/
│   │   │       ├── page.jsx          ← App builder form (/experience/app)
│   │   │       └── result/
│   │   │           └── page.jsx      ← App result screen
│   │   └── layout.jsx                ← Root layout (font, metadata, PageShell)
│   │
│   ├── components/                   ← All reusable UI components
│   │   ├── shared/                   ← Used by both experiences
│   │   │   ├── PageShell.jsx
│   │   │   ├── StepHeader.jsx
│   │   │   ├── StepProgress.jsx
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── GhostButton.jsx
│   │   │   ├── ColorSwatchPicker.jsx
│   │   │   ├── AvatarPicker.jsx
│   │   │   ├── CodeBoxxCTA.jsx
│   │   │   ├── SeeTheCodePanel.jsx
│   │   │   └── CodeBlock.jsx
│   │   ├── webpage/                  ← Experience 1 components
│   │   │   ├── WebPageFormStep1.jsx
│   │   │   ├── WebPageFormStep2.jsx
│   │   │   ├── WebPageFormStep3.jsx
│   │   │   ├── WebPageLivePreview.jsx
│   │   │   └── WebPageResultCard.jsx
│   │   └── app/                      ← Experience 2 components
│   │       ├── AppFormStep1.jsx
│   │       ├── AppFormStep2.jsx
│   │       ├── AppFormStep3.jsx
│   │       ├── AppLivePreview.jsx
│   │       ├── AppResultCard.jsx
│   │       └── MessageCycler.jsx
│   │
│   ├── context/                      ← React Context providers
│   │   ├── WebPageContext.jsx         ← Context + Provider for Experience 1 state
│   │   └── AppBuilderContext.jsx      ← Context + Provider for Experience 2 state
│   │
│   ├── data/                         ← Static config data
│   │   ├── themes.js                 ← THEME_COLORS + DEFAULT_THEME
│   │   └── avatars.js                ← AVATAR_OPTIONS
│   │
│   └── utils/                        ← Pure utility functions
│       ├── generateWebPageCode.js    ← Builds HTML string for Experience 1 result
│       └── generateAppCode.js        ← Builds HTML+JS string for Experience 2 result
│
├── public/
│   └── codeboxx-logo.png            ← Logo used in CTA
│
├── ai/                              ← AI specification documents
│   ├── ai-spec.md                   ← THIS FILE
│   └── features/                    ← Per-feature spec files
│
├── .env.local                       ← Environment variables (see below)
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js (App Router) | Framework — routing, SSR/CSR, layout system |
| React | UI component library |
| Tailwind CSS | Utility-first styling — mobile-first by default |
| React Context API | Lightweight global state (no Redux needed) |
| Vercel | Deployment target |

> No backend server. No database. No authentication library. Keep the dependency list short.

---

## Design System

### Brand Colors (CodeBoxx)

| Name | Hex | Usage |
|---|---|---|
| CodeBoxx Black | `#0D0D0D` | Primary text, headers |
| CodeBoxx Yellow | `#F5C518` | Accent, CTA buttons, highlights |
| CodeBoxx White | `#FFFFFF` | Background, card surfaces |
| Neutral Gray | `#6B7280` | Secondary text, borders |

> User-selected theme colors (from `THEME_COLORS`) apply only within the preview and result cards, not to the app's own UI chrome.

### Typography

- **Font:** System font stack (`font-sans` in Tailwind) — no Google Fonts import to maximize load speed at events with spotty WiFi
- **Heading sizes:** `text-2xl` for page titles, `text-lg` for section headers, `text-base` for body
- **Line height:** `leading-relaxed` throughout for readability on small screens

### Mobile-First Rules

- Minimum touch target size: **44x44px** for all tappable elements
- All inputs use `text-base` or larger to prevent iOS auto-zoom on focus
- No horizontal scrolling at any viewport width
- Live preview panels use a phone-frame wrapper (fixed aspect ratio) so students see a realistic representation
- Max content width: `max-w-md` centered on larger screens; full-width on mobile

### Animation

- Form step transitions: `fade` + `slide-up` (CSS transitions, no animation library)
- Live preview updates: instant (no debounce required — inputs are short)
- Code panel expand/collapse: CSS `max-height` transition

---

## Environment Variables

### `.env.local`

```
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
NEXT_PUBLIC_CTA_URL=https://codeboxx.ca
```

> No secrets. No API keys. All values are public-safe.

---

## Build Phases

### Phase 1 — Foundation
- Next.js project setup with Tailwind CSS
- Folder structure scaffolded
- `themes.js` and `avatars.js` data files created
- `PageShell`, `PrimaryButton`, `GhostButton`, `StepHeader`, `StepProgress` components built
- Landing page (`/`) and Experience Selector (`/select`) implemented

### Phase 2 — Experience 1 (Web Page Builder)
- `WebPageContext` created with default state
- Form steps 1–3 built (`WebPageFormStep1`, `WebPageFormStep2`, `WebPageFormStep3`)
- `WebPageLivePreview` component rendering live from context
- `ColorSwatchPicker` and `AvatarPicker` components
- Result screen with `WebPageResultCard`
- `generateWebPageCode.js` utility
- `SeeTheCodePanel` + `CodeBlock` components
- `CodeBoxxCTA` component
- Full `/experience/webpage` → `/experience/webpage/result` flow working end-to-end

### Phase 3 — Experience 2 (App Builder)
- `AppBuilderContext` created with default state
- Form steps 1–3 built
- `MessageCycler` component (the actual interactive cycling app)
- `AppLivePreview` wrapping `MessageCycler`
- Result screen with `AppResultCard`
- `generateAppCode.js` utility
- Full `/experience/app` → `/experience/app/result` flow working end-to-end

### Phase 4 — Polish & Deploy
- Cross-device testing on real phones (iOS Safari, Android Chrome)
- Edge case handling: empty fields, very long inputs, slow network
- Accessibility pass: focus states, contrast, tap targets
- Vercel deployment configured
- QR code generated pointing to production URL
- README written with event setup instructions for CodeBoxx staff

---

## Acceptance Criteria

A feature is considered complete when **all** of the following are true:

- [ ] The feature renders correctly on a 375px-wide mobile viewport (iPhone SE)
- [ ] All touch targets are at least 44x44px
- [ ] No input field causes iOS Safari to auto-zoom on focus
- [ ] Live preview updates in real time as form fields change
- [ ] The "See the Code" section contains code that reflects the user's actual inputs
- [ ] Code comments in the generated output are beginner-friendly plain English
- [ ] The `CodeBoxxCTA` component is visible on every result screen without scrolling
- [ ] Navigating directly to a result route without form state redirects to `/select`
- [ ] The feature branch has been merged into `dev` before merging to `main`
- [ ] No console errors or unhandled promise rejections on any screen
- [ ] The full experience (landing → select → form → result) completes in ≤5 minutes

---

## Coding Standards and Conventions

### General

- Use **beginner-readable code** — clear variable names, no clever one-liners, short functions with single responsibilities
- Every file gets a one-line comment at the top explaining its purpose
- Do not add features not listed in this spec or the feature files
- Reuse existing components — do not duplicate logic or styling
- Do not refactor code outside the scope of the current feature being built

### Components

- All components are functional components using React Hooks
- Props are named clearly — avoid single-letter or cryptic names
- Each component file exports one default component
- Components handle only UI concerns — data transformation happens in `utils/`

### State

- Context providers live in `src/context/` and wrap only the routes that need them
- Do not lift state higher than necessary
- Component-local state (`useState`) is fine for toggle, input focus, and step tracking

### Styling

- Tailwind utility classes only — no custom CSS files except for global base styles in `globals.css`
- No inline `style` prop except inside the live preview panels where dynamic theme colors must be applied (Tailwind cannot interpolate arbitrary hex values at runtime)
- Mobile-first: write base styles for mobile, then add `md:` / `lg:` breakpoints where needed

### Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `ColorSwatchPicker.jsx` |
| Non-component JS files | camelCase | `generateWebPageCode.js` |
| Context files | PascalCase | `WebPageContext.jsx` |
| Data files | camelCase | `themes.js`, `avatars.js` |
| Tailwind class strings | kebab-case (Tailwind default) | `text-base`, `bg-white` |
| Environment variables | SCREAMING_SNAKE_CASE | `NEXT_PUBLIC_CTA_URL` |

---

## Cross-Feature Rules

These rules apply to every feature, everywhere, always:

1. **No login, no session, no cookies.** The entire app is stateless from the server's perspective.
2. **No direct commits to `main`.** All work goes through `feature/*` → `dev` → `main`.
3. **Generated code must reflect real user inputs.** The "See the Code" output is not hardcoded — it is built from the context values at the time the result screen renders.
4. **The CodeBoxx CTA is non-negotiable.** It must appear on every result screen. It must not be hidden behind a scroll or toggle.
5. **Performance first.** No large dependencies. No image-heavy assets. The app must load fast on a mobile network at a noisy event.
6. **Theme colors are applied via inline styles in previews only.** Tailwind cannot generate arbitrary color classes at runtime. Use `style={{ backgroundColor: theme.hex }}` inside preview and result card components.
7. **Redirects protect result routes.** If a result page is loaded without the corresponding context state being populated, redirect the user to `/select` immediately.
8. **Feature branches are created from `dev`.** Never branch from `main`.

---

## Future Features (Post-MVP)

These are **explicitly out of scope** for the current build but should be designed around:

| Feature | Notes |
|---|---|
| Share link / unique URL | Generate a unique shareable URL so students can revisit or send their creation |
| Analytics dashboard | Track scans, completions, and experience selection by event |
| Event-specific landing | Customize the entry screen per event (school name, date) via URL param |
| Export / download | Allow students to download their generated HTML file |
| More experiences | e.g. "Build Your First API Call", "Build Your First Quiz" |
| Admin QR generator | Internal tool for CodeBoxx staff to generate event-specific QR codes |
