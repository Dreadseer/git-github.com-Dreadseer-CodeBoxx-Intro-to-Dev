# ⚙️ FEATURE SPEC — Project Configuration & Setup

> **Read `ai-spec.md` first.** This file defines only what is specific to the configuration feature.
> The global spec overrides anything here in case of conflict.

---

## Purpose

This feature covers everything required to go from zero to a running local development environment with the correct folder structure, dependencies, configuration files, and a working root layout. No UI is built in this phase — this is pure foundation work.

---

## Step 1 — Initialize the Next.js Project

Run the following command in your terminal from the parent folder where you want the project to live:

```bash
npx create-next-app@latest codeboxx-event-experience
```

When prompted, answer as follows:

| Prompt | Answer |
|---|---|
| Would you like to use TypeScript? | **No** |
| Would you like to use ESLint? | **Yes** |
| Would you like to use Tailwind CSS? | **Yes** |
| Would you like your code inside a `src/` directory? | **Yes** |
| Would you like to use App Router? | **Yes** |
| Would you like to use Turbopack for `next dev`? | **No** |
| Would you like to customize the import alias? | **No** |

Once complete, move into the project directory:

```bash
cd codeboxx-event-experience
```

---

## Step 2 — Verify the Dev Server Runs

Before touching anything else, confirm the base install works:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. You should see the default Next.js welcome page. Once confirmed, stop the server (`Ctrl + C`) and continue.

---

## Step 3 — Clean Up Default Files

`create-next-app` generates placeholder content that we don't need. Remove or replace the following:

### Delete these files:
```
src/app/favicon.ico       ← replace with CodeBoxx favicon later (leave for now)
public/next.svg
public/vercel.svg
```

### Replace `src/app/globals.css` with:
```css
/* globals.css — base styles applied to the entire app */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Prevent iOS Safari from zooming in on form inputs */
input, select, textarea {
  font-size: 16px;
}

/* Smooth scrolling for the whole app */
html {
  scroll-behavior: smooth;
}

/* Remove default body margin */
body {
  margin: 0;
  padding: 0;
}
```

### Replace `src/app/page.jsx` with a temporary placeholder:
```jsx
// page.jsx — Landing page (root route). Content will be built in the landing feature.

export default function LandingPage() {
  return (
    <main>
      <p>CodeBoxx Event Experience — coming soon.</p>
    </main>
  );
}
```

---

## Step 4 — Scaffold the Folder Structure

Create all required folders now, even if they are empty. This keeps the project organized from the start and prevents confusion later.

Run these commands from inside the project root:

```bash
mkdir -p src/components/shared
mkdir -p src/components/webpage
mkdir -p src/components/app
mkdir -p src/context
mkdir -p src/data
mkdir -p src/utils
mkdir -p src/app/select
mkdir -p src/app/experience/webpage/result
mkdir -p src/app/experience/app/result
mkdir -p ai/features
mkdir -p public
```

Then create empty placeholder files so the folders are tracked by Git:

```bash
touch src/components/shared/.gitkeep
touch src/components/webpage/.gitkeep
touch src/components/app/.gitkeep
touch src/context/.gitkeep
touch src/data/.gitkeep
touch src/utils/.gitkeep
```

---

## Step 5 — Create the Static Data Files

These files contain the theme colors and avatar options used across both experiences. Create them now so they are available when components are built.

### `src/data/themes.js`

```js
// themes.js — Defines the color theme options users can choose from.
// These are used in the ColorSwatchPicker and applied via inline styles in previews.

export const THEME_COLORS = {
  purple: { label: "Purple",  hex: "#7C3AED", text: "#ffffff" },
  blue:   { label: "Blue",    hex: "#2563EB", text: "#ffffff" },
  teal:   { label: "Teal",    hex: "#0D9488", text: "#ffffff" },
  orange: { label: "Orange",  hex: "#EA580C", text: "#ffffff" },
  pink:   { label: "Pink",    hex: "#DB2777", text: "#ffffff" },
  slate:  { label: "Slate",   hex: "#475569", text: "#ffffff" },
};

// The theme key that is selected by default before a user makes a choice
export const DEFAULT_THEME = "purple";
```

### `src/data/avatars.js`

```js
// avatars.js — Defines the avatar/icon options for Experience 1 (Web Page Builder).
// Each option uses an emoji so no image files are required.

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

// The avatar key selected by default (can be overridden by user)
export const DEFAULT_AVATAR = "rocket";
```

---

## Step 6 — Configure the Root Layout

Replace the contents of `src/app/layout.jsx` with the following:

```jsx
// layout.jsx — Root layout applied to every page in the app.
// Sets the page title, metadata, and global font/background.

import "./globals.css";

// Metadata shown in the browser tab and when the link is shared
export const metadata = {
  title: "CodeBoxx — Build Something Today",
  description:
    "Scan. Tap. Build. Create your first web page or app in 5 minutes at a CodeBoxx event.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## Step 7 — Create the `.env.local` File

Create a `.env.local` file in the project root:

```
# .env.local — Environment variables for local development.
# These are safe to expose publicly (NEXT_PUBLIC_ prefix).

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CTA_URL=https://codeboxx.ca
```

> **Important:** Add `.env.local` to `.gitignore` if it is not already there. Confirm this line exists in `.gitignore`:
> ```
> .env.local
> ```

When deploying to Vercel, these variables must be added manually in the Vercel project dashboard under **Settings → Environment Variables**.

---

## Step 8 — Add the CodeBoxx Logo

Place the CodeBoxx logo file in the `public/` folder:

```
public/codeboxx-logo.png
```

This file will be used by the `CodeBoxxCTA` component built in a later feature. If the final logo file is not yet available, create a placeholder text file named `public/codeboxx-logo.png.placeholder` as a reminder.

---

## Step 9 — Initialize Git and Create the `dev` Branch

```bash
git init
git add .
git commit -m "chore: initial project setup and folder scaffold"
git checkout -b dev
```

> All feature branches are created from `dev`. Never commit directly to `main`.

---

## Step 10 — Verify the Final Structure

Run the dev server one more time to confirm everything still works after cleanup:

```bash
npm run dev
```

The browser should show the temporary placeholder text: **"CodeBoxx Event Experience — coming soon."**

Your folder structure should now look like this:

```
codeboxx-event-experience/
│
├── src/
│   ├── app/
│   │   ├── experience/
│   │   │   ├── app/
│   │   │   │   └── result/
│   │   │   └── webpage/
│   │   │       └── result/
│   │   ├── select/
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── app/
│   │   ├── shared/
│   │   └── webpage/
│   ├── context/
│   ├── data/
│   │   ├── avatars.js
│   │   └── themes.js
│   └── utils/
│
├── ai/
│   ├── ai-spec.md
│   └── features/
│       └── configuration.feature.md
│
├── public/
│   └── codeboxx-logo.png
│
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Acceptance Criteria

- [ ] `npm run dev` runs without errors
- [ ] Browser loads at `http://localhost:3000` showing the placeholder page
- [ ] No default Next.js SVG assets remain in `public/`
- [ ] `globals.css` includes the `font-size: 16px` fix for iOS Safari input zoom
- [ ] All folders from the spec are present
- [ ] `src/data/themes.js` and `src/data/avatars.js` exist and export the correct data
- [ ] `.env.local` exists with both `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CTA_URL`
- [ ] `.env.local` is listed in `.gitignore`
- [ ] Git is initialized with an initial commit on the `dev` branch
- [ ] `codeboxx-logo.png` (or its placeholder) is in `public/`
