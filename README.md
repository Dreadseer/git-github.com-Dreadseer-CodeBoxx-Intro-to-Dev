# CodeBoxx Build Lab

**Scan. Build. Launch.** A mobile-first, QR-code-accessible web experience for CodeBoxx recruitment events. A prospective student scans a QR code at a booth and, in about five minutes — with no account, no install, and no coding knowledge — builds either a personal landing page or a working interactive app, watches it assemble around their decisions, launches it, and sees the real code behind it.

The goal isn't the artifact. It's the realization at the end:

> *"I just made a series of decisions and a working product formed around them. That's what software development is. Maybe I could learn to do this."*

---

## The Experience

```
QR SCAN
   ↓
ENTRY            "SYSTEM READY_  Build something real. Right now."  →  START BUILD
   ↓
MISSION 01       Choose Your Build — Creator Page (Path A) or Interactive App (Path B)
   ↓
MISSIONS 02–04   Identity → Style → Icon   (or  Concept → Content → Style)
                 Every choice instantly reshapes a live phone-frame preview
                 and regenerates real, commented HTML/CSS/JS below it
   ↓
LAUNCH           A build sequence assembles the project:
                 LAYOUT ✓  STYLE ✓  CONTENT ✓  INTERACTIONS ✓ → PROJECT READY → LAUNCH
   ↓
BUILD COMPLETE   The finished, working creation + build stats
                 (decisions made, modules installed, lines of code)
   ↓
CODEBOXX         The recruitment connection — after the payoff, never before it
```

Along the way the interface behaves like a **build console**, not a form:

- **Mission track + BUILD %** — visible progression (`IDENTITY ✓ — STYLE — ICON — LAUNCH`, `BUILD 72% · 4 DECISIONS`)
- **Live preview** — the one bright (white) object in the dark lab; the user's creation is always the focal point
- **Live source panel** — the generated code scrolls and highlights the exact lines the user's last change produced
- **Modules** — optional widgets (heading, button, contact form, message box, social links) that can be tapped or dragged into the creation, with a `▲ MODULE INSTALLED` confirmation
- **Launch sequence** — a short (< 2.5s) completion payoff instead of a "Submit" button

There are also a couple of easter eggs. Tap things. Read your own source code to the end.

## Two Sites in One Repo

| Route | Audience | Purpose |
|---|---|---|
| `/` | Event attendees (mobile) | The Build Lab itself — the QR code points here |
| `/about` | Staff, employers, portfolio reviewers (desktop) | Scroll-narrative case study: the problem, the experience, the engineering story, and a **live embedded demo** of the app inside a phone frame |

## Zero Friction Is the Architecture

The entire product is designed backwards from one constraint: *a stranger's phone, an unknown browser, and five minutes of attention.*

- **No accounts, no login, no database.** Builds live in React context, mirrored to `sessionStorage` so a locked phone or accidental refresh doesn't lose the work — and closing the tab is a clean goodbye.
- **No heavy dependencies.** Next.js, React, Tailwind. System fonts, emoji instead of icon packs, CSS-only motion (transform/opacity, with `prefers-reduced-motion` support). The first screen is interactive in seconds on event Wi-Fi.
- **Instant feedback everywhere.** Every choice re-renders the preview and regenerates real source code. The feedback loop *is* the lesson.
- **One-handed, standing use.** 44px+ touch targets, primary CTAs in the thumb zone, inputs sized to prevent iOS auto-zoom, no horizontal scroll.

The only server-side code is one API route (`/api/send-code`) that emails students their generated HTML file via [Resend](https://resend.com) — optional, and the app degrades gracefully without it.

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js](https://nextjs.org) (App Router) | Framework — routing, static prerendering, the one API route |
| React 19 | UI components, context-based state |
| Tailwind CSS 4 | Styling — design tokens defined in `@theme` in `globals.css` |
| Resend | Email delivery for "Email me my code" (optional) |
| Vercel | Hosting and deployment |

## Architecture

The key idea: **both build paths run on the same engine, configured by data.**

```
src/
├── app/                        # Routes
│   ├── page.jsx                #   /            — entry screen
│   ├── select/                 #   /select      — Mission 01: choose your build
│   ├── experience/
│   │   ├── webpage/            #   Path A: builder + result (wrapped in BuilderProvider)
│   │   └── app/                #   Path B: builder + result (wrapped in BuilderProvider)
│   ├── about/                  #   /about       — desktop case-study site
│   └── api/send-code/          #   POST — emails the generated code (Resend)
│
├── data/
│   ├── experiences.js          # ★ Per-path config: missions, defaults, required fields, routes
│   ├── themes.js               #   Theme palette (+ one hidden theme)
│   ├── avatars.js              #   Emoji avatar options
│   └── widgets.js              #   Installable module definitions
│
├── context/
│   └── BuilderContext.jsx      # ★ Single state provider for both paths:
│                               #   form data, decisions counter, build %, sessionStorage sync
│
├── components/
│   ├── shared/
│   │   ├── BuilderScreen.jsx   # ★ The whole mission flow (steps, modules, toasts, launch)
│   │   ├── ResultScreen.jsx    # ★ The whole BUILD COMPLETE screen
│   │   ├── LaunchSequence.jsx  #   Completion payoff overlay
│   │   ├── BuildProgress.jsx   #   Mission track + build % bar
│   │   ├── MissionHeader.jsx, BuildToast.jsx, FormField.jsx, ...
│   │   └── Widget*.jsx         #   Module tray / canvas / editor / placement sheet
│   ├── webpage/                #   Path A step forms, live preview, result card
│   └── app/                    #   Path B step forms, live preview, result card
│
└── utils/
    ├── generateWebPageCode.js  #   Builds the real HTML from the user's choices
    ├── generateAppCode.js      #   Builds the real HTML+JS from the user's choices
    └── getHighlightKey.js      #   Maps "last change" → which code lines to highlight
```

`★` = where the interesting decisions live. The route pages are thin wrappers: a builder page is ~20 lines that hand `BuilderScreen` its step components, preview, and code generator. **Adding a third experience path** is mostly a new entry in `experiences.js` plus its step/preview components — the flow, progress system, persistence, launch sequence, and result screen come for free.

### Design system

Defined as Tailwind `@theme` tokens in [`src/app/globals.css`](src/app/globals.css): a dark "lab" surface scale (`ink-950` → `ink-700`), CodeBoxx yellow (`#F5C518`) as the single system accent, a monospace "machine voice" for system labels (`.sys`), and a small set of keyframed motion utilities (`animate-rise`, `animate-pop`, `animate-preview-ping`, `animate-scan`). The user's creation always renders on white — deliberately the brightest thing in the lab.

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

### Environment variables

All optional for local development.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Enables the "Email me my code" feature (server-side) |
| `RESEND_FROM_EMAIL` | Sender address for outgoing mail |
| `RESEND_TO_COPY` | Internal address that receives a copy of each submission |
| `NEXT_PUBLIC_CTA_URL` | CodeBoxx CTA link target (defaults to `https://codeboxx.com`) |

Without the Resend variables, the email endpoint returns `503` and the form shows a friendly error — everything else works.

## Deployment

Deployed on **Vercel** — push to `main` and it ships. The email API route runs as a serverless function; set the environment variables above in the Vercel project settings.

## Event Setup

1. Deploy, and generate a QR code pointing at the production root URL (`/`).
2. Print it big. Put it at the booth.
3. That's it — no staff instruction required. If someone asks what it is, the correct answer is *"scan it and find out."*

---

Built for CodeBoxx Academy as a recruitment-event experience and engineering case study. The design writeup lives at [`/about`](src/app/about/page.jsx) on the deployed site; the original product specs are in [`ai/`](ai/).
