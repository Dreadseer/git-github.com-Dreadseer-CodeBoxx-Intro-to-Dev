# 🧩 FEATURE SPEC — Shared Components

> **Read `ai-spec.md` first.** This file defines only what is specific to the shared component library.
> The global spec overrides anything here in case of conflict.

---

## Purpose

This feature builds the reusable component library that every experience screen depends on. None of the experience pages (form steps, previews, result screens) should be built before these components exist. Build and verify each component individually before moving on.

All components live in `src/components/shared/`.

---

## Component List

| Component | File | Purpose |
|---|---|---|
| `PageShell` | `PageShell.jsx` | Consistent full-page wrapper with padding and max-width |
| `StepHeader` | `StepHeader.jsx` | Back arrow + page title for multi-step screens |
| `StepProgress` | `StepProgress.jsx` | Dot-based step indicator |
| `PrimaryButton` | `PrimaryButton.jsx` | Main action button |
| `GhostButton` | `GhostButton.jsx` | Secondary / back navigation button |
| `ColorSwatchPicker` | `ColorSwatchPicker.jsx` | Row of tappable color swatches |
| `AvatarPicker` | `AvatarPicker.jsx` | Grid of tappable emoji avatar options |

---

## Component Specifications

---

### `PageShell`

**Purpose:** Wraps every experience page. Enforces consistent max-width, padding, background color, and vertical layout so individual pages don't repeat these styles.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `children` | node | Yes | Page content |

**Behavior:**
- Renders a `<main>` element
- Full min-height screen: `min-h-screen`
- White background: `bg-white`
- Centered with max width: `max-w-md mx-auto`
- Horizontal padding: `px-6`
- Vertical padding: `py-10`
- Flex column layout: `flex flex-col`

**File: `src/components/shared/PageShell.jsx`**
```jsx
// PageShell.jsx — Wrapper applied to every experience page.
// Handles max-width, padding, and vertical layout consistently.

export default function PageShell({ children }) {
  return (
    <main className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-md mx-auto">
      {children}
    </main>
  );
}
```

---

### `StepHeader`

**Purpose:** Displays the back arrow and title at the top of each form step screen.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | The page or step title |
| `backHref` | string | No | If provided, renders a `<Link>` back arrow to this path |
| `onBack` | function | No | If provided (and no `backHref`), renders a `<button>` that calls this function |

**Behavior:**
- If `backHref` is provided, the back arrow is a `<Link href={backHref}>`
- If `onBack` is provided instead, the back arrow is a `<button onClick={onBack}>`
- If neither is provided, no back arrow is rendered
- Title is always rendered to the right of the arrow

**File: `src/components/shared/StepHeader.jsx`**
```jsx
// StepHeader.jsx — Displays the back arrow and title at the top of a step screen.
// Accepts either a link (backHref) or a function (onBack) for the back action.

import Link from "next/link";

export default function StepHeader({ title, backHref, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-6">

      {/* Back arrow — renders as a Link or a button depending on which prop is passed */}
      {backHref && (
        <Link href={backHref} className="text-gray-500 text-xl font-bold leading-none">
          ←
        </Link>
      )}
      {onBack && !backHref && (
        <button
          onClick={onBack}
          className="text-gray-500 text-xl font-bold leading-none"
        >
          ←
        </button>
      )}

      {/* Page or step title */}
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>

    </div>
  );
}
```

---

### `StepProgress`

**Purpose:** Shows the student how far along they are in a multi-step form using a row of dots.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `totalSteps` | number | Yes | Total number of steps in the flow |
| `currentStep` | number | Yes | The current step (1-indexed) |

**Behavior:**
- Renders a row of `totalSteps` dots
- The dot for the current step is filled (dark): `bg-gray-900`
- All other dots are empty (light): `bg-gray-300`
- Dots are centered horizontally
- Each dot is `10px x 10px`, rounded full, with a small gap between them

**File: `src/components/shared/StepProgress.jsx`**
```jsx
// StepProgress.jsx — Dot-based step progress indicator for multi-step forms.
// Shows students how many steps remain in the experience.

export default function StepProgress({ totalSteps, currentStep }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {/* Create one dot for each step */}
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full ${
            index + 1 === currentStep ? "bg-gray-900" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
```

---

### `PrimaryButton`

**Purpose:** The main action button used to advance through steps and submit forms.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | string | Yes | Button text |
| `onClick` | function | Yes | Function called when button is tapped |
| `disabled` | boolean | No | If true, button is visually muted and non-interactive |

**Behavior:**
- Full width: `w-full`
- CodeBoxx yellow background: `bg-yellow-400`
- Bold black text: `text-gray-900 font-bold`
- Large tap target: `py-4 text-lg`
- Rounded: `rounded-2xl`
- When `disabled` is true: `opacity-40 cursor-not-allowed`

**File: `src/components/shared/PrimaryButton.jsx`**
```jsx
// PrimaryButton.jsx — Main action button used to advance through steps.
// Yellow background, full width, large tap target.

export default function PrimaryButton({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-yellow-400 text-gray-900 font-bold text-lg py-4 rounded-2xl mt-4 ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
}
```

---

### `GhostButton`

**Purpose:** Secondary button used for back navigation or optional actions within a step.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | string | Yes | Button text |
| `onClick` | function | Yes | Function called when button is tapped |

**Behavior:**
- Full width: `w-full`
- Transparent background with gray border: `bg-transparent border border-gray-300`
- Gray text: `text-gray-600`
- Same sizing as `PrimaryButton`: `py-4 text-lg rounded-2xl`
- Used below `PrimaryButton` when a back/skip option is needed

**File: `src/components/shared/GhostButton.jsx`**
```jsx
// GhostButton.jsx — Secondary button for back navigation or optional actions.
// Transparent background with a gray border.

export default function GhostButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-transparent border border-gray-300 text-gray-600 font-semibold text-lg py-4 rounded-2xl mt-2"
    >
      {label}
    </button>
  );
}
```

---

### `ColorSwatchPicker`

**Purpose:** Lets the student pick a theme color by tapping a colored circle. Used in both experiences.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `selectedColor` | string | Yes | The currently selected color key (e.g. `"purple"`) |
| `onChange` | function | Yes | Called with the color key when a swatch is tapped |

**Behavior:**
- Imports `THEME_COLORS` from `src/data/themes.js`
- Renders one circular swatch per theme entry
- Swatches are displayed in a centered row with gaps
- Each swatch is `48x48px`, fully rounded: `w-12 h-12 rounded-full`
- Background color is applied via inline style: `style={{ backgroundColor: theme.hex }}`
- The selected swatch has a visible ring: `ring-2 ring-offset-2 ring-gray-900`
- Unselected swatches have no ring
- Each swatch has an `aria-label` for accessibility: `aria-label={theme.label}`

**File: `src/components/shared/ColorSwatchPicker.jsx`**
```jsx
// ColorSwatchPicker.jsx — Row of tappable color swatches for theme selection.
// Used in both experiences to let students pick their color.

import { THEME_COLORS } from "@/data/themes";

export default function ColorSwatchPicker({ selectedColor, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 my-4">
      {Object.entries(THEME_COLORS).map(([key, theme]) => (
        <button
          key={key}
          aria-label={theme.label}
          onClick={() => onChange(key)}
          style={{ backgroundColor: theme.hex }}
          className={`w-12 h-12 rounded-full ${
            selectedColor === key
              ? "ring-2 ring-offset-2 ring-gray-900"
              : ""
          }`}
        />
      ))}
    </div>
  );
}
```

---

### `AvatarPicker`

**Purpose:** Lets the student pick an emoji avatar/icon for their personal web page. Used in Experience 1 only.

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `selectedAvatar` | string | Yes | The currently selected avatar key (e.g. `"rocket"`) |
| `onChange` | function | Yes | Called with the avatar key when an option is tapped |

**Behavior:**
- Imports `AVATAR_OPTIONS` from `src/data/avatars.js`
- Renders a 4-column grid of emoji buttons
- Each button shows the emoji and its label below
- Selected avatar has a highlighted background: `bg-yellow-100 border-yellow-400`
- Unselected avatars have a neutral background: `bg-gray-50 border-gray-200`
- Each button has a border, rounded corners, and enough padding for a comfortable tap target
- Min button height: `72px`

**File: `src/components/shared/AvatarPicker.jsx`**
```jsx
// AvatarPicker.jsx — Grid of emoji avatar options for Experience 1.
// Students pick an icon that appears on their personal landing page.

import { AVATAR_OPTIONS } from "@/data/avatars";

export default function AvatarPicker({ selectedAvatar, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-3 my-4">
      {AVATAR_OPTIONS.map((avatar) => (
        <button
          key={avatar.key}
          onClick={() => onChange(avatar.key)}
          className={`flex flex-col items-center justify-center min-h-[72px] rounded-xl border p-2 ${
            selectedAvatar === avatar.key
              ? "bg-yellow-100 border-yellow-400"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <span className="text-2xl">{avatar.emoji}</span>
          <span className="text-xs text-gray-600 mt-1">{avatar.label}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## Import Alias

All imports from `src/` use the `@/` alias configured by `create-next-app` by default.

```js
// Correct
import { THEME_COLORS } from "@/data/themes";

// Incorrect — do not use relative paths for data/utils imports
import { THEME_COLORS } from "../../data/themes";
```

---

## Acceptance Criteria

- [ ] All 7 component files exist in `src/components/shared/`
- [ ] Each file has a one-line comment at the top explaining its purpose
- [ ] `PageShell` renders `children` inside a centered, padded `<main>` element
- [ ] `StepHeader` renders a `<Link>` back arrow when `backHref` is passed
- [ ] `StepHeader` renders a `<button>` back arrow when `onBack` is passed
- [ ] `StepHeader` renders no back arrow when neither prop is passed
- [ ] `StepProgress` correctly fills the current step dot and leaves others empty
- [ ] `PrimaryButton` is visually muted and non-interactive when `disabled={true}`
- [ ] `ColorSwatchPicker` shows a ring around the selected swatch
- [ ] `ColorSwatchPicker` calls `onChange` with the correct color key on tap
- [ ] `AvatarPicker` highlights the selected avatar with a yellow background
- [ ] `AvatarPicker` calls `onChange` with the correct avatar key on tap
- [ ] `@/` import alias resolves correctly for `themes.js` and `avatars.js`
- [ ] No console errors or warnings when components are rendered
