# 🗂️ FEATURE SPEC — React Context (State Management)

> **Read `ai-spec.md` first.** This file defines only what is specific to the Context setup.
> The global spec overrides anything here in case of conflict.

---

## Purpose

This feature creates the two React Context providers that manage form state across each experience's multi-step flow. Context is the bridge between the form steps, the live preview, and the result screen — without it, each step would have no memory of what the previous step collected.

Both contexts must be created before any experience form steps or preview components are built.

---

## Files

| File | Purpose |
|---|---|
| `src/context/WebPageContext.jsx` | State for Experience 1 — Web Page Builder |
| `src/context/AppBuilderContext.jsx` | State for Experience 2 — App Builder |

---

## Context 1 — `WebPageContext`

### State Shape

```js
{
  name: "",           // Student's name — e.g. "Alex"
  dreamJob: "",       // e.g. "Game Developer"
  bio: "",            // Short sentence about themselves
  themeColor: "purple", // Key from THEME_COLORS — defaults to "purple"
  avatar: "rocket"    // Key from AVATAR_OPTIONS — defaults to "rocket"
}
```

### What It Exports

- `WebPageProvider` — the Context provider component, wraps the experience route
- `useWebPage` — a custom hook that returns `{ formData, updateField }` for any consumer

### `updateField` Function

```js
// Updates a single field in the formData object by key
// Example: updateField("name", "Alex") sets formData.name to "Alex"
updateField(key, value)
```

### Where It Is Used

- Wraps `/experience/webpage` and `/experience/webpage/result` via the layout file for that route segment
- Consumed by: `WebPageFormStep1`, `WebPageFormStep2`, `WebPageFormStep3`, `WebPageLivePreview`, `WebPageResultCard`, and `generateWebPageCode`

### Full File

**`src/context/WebPageContext.jsx`**
```jsx
// WebPageContext.jsx — Manages form state for Experience 1 (Web Page Builder).
// Provides formData and updateField to all steps, the preview, and the result screen.

"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_THEME } from "@/data/themes";
import { DEFAULT_AVATAR } from "@/data/avatars";

// Create the context object
const WebPageContext = createContext(null);

// The default state a student starts with before filling anything in
const defaultFormData = {
  name: "",
  dreamJob: "",
  bio: "",
  themeColor: DEFAULT_THEME,
  avatar: DEFAULT_AVATAR,
};

// Provider component — wraps the experience route so all children can access state
export function WebPageProvider({ children }) {
  const [formData, setFormData] = useState(defaultFormData);

  // Updates a single field without overwriting the rest of the form data
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <WebPageContext.Provider value={{ formData, updateField }}>
      {children}
    </WebPageContext.Provider>
  );
}

// Custom hook — components call useWebPage() instead of useContext(WebPageContext)
export function useWebPage() {
  const context = useContext(WebPageContext);
  if (!context) {
    throw new Error("useWebPage must be used inside a WebPageProvider");
  }
  return context;
}
```

---

## Context 2 — `AppBuilderContext`

### State Shape

```js
{
  appTitle: "",           // Name of their mini app — e.g. "My Mood Button"
  buttonLabel: "",        // Text on the button — e.g. "Tap Me"
  messages: ["", "", ""], // Three short messages to cycle through
  themeColor: "blue"      // Key from THEME_COLORS — defaults to "blue"
}
```

### What It Exports

- `AppBuilderProvider` — the Context provider component, wraps the experience route
- `useAppBuilder` — a custom hook that returns `{ formData, updateField, updateMessage }` for any consumer

### `updateField` Function

```js
// Updates a single top-level field in the formData object by key
// Example: updateField("appTitle", "My Mood Button")
updateField(key, value)
```

### `updateMessage` Function

```js
// Updates a single message in the messages array by index (0, 1, or 2)
// Example: updateMessage(0, "You're amazing!") sets messages[0]
updateMessage(index, value)
```

### Where It Is Used

- Wraps `/experience/app` and `/experience/app/result` via the layout file for that route segment
- Consumed by: `AppFormStep1`, `AppFormStep2`, `AppFormStep3`, `AppLivePreview`, `AppResultCard`, and `generateAppCode`

### Full File

**`src/context/AppBuilderContext.jsx`**
```jsx
// AppBuilderContext.jsx — Manages form state for Experience 2 (App Builder).
// Provides formData, updateField, and updateMessage to all steps, the preview, and the result screen.

"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_THEME } from "@/data/themes";

// Create the context object
const AppBuilderContext = createContext(null);

// The default state a student starts with before filling anything in
const defaultFormData = {
  appTitle: "",
  buttonLabel: "",
  messages: ["", "", ""],
  themeColor: DEFAULT_THEME,
};

// Provider component — wraps the experience route so all children can access state
export function AppBuilderProvider({ children }) {
  const [formData, setFormData] = useState(defaultFormData);

  // Updates a single top-level field without overwriting the rest of the form data
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // Updates one message in the messages array by its index position (0, 1, or 2)
  function updateMessage(index, value) {
    setFormData((prev) => {
      const updatedMessages = [...prev.messages];
      updatedMessages[index] = value;
      return { ...prev, messages: updatedMessages };
    });
  }

  return (
    <AppBuilderContext.Provider value={{ formData, updateField, updateMessage }}>
      {children}
    </AppBuilderContext.Provider>
  );
}

// Custom hook — components call useAppBuilder() instead of useContext(AppBuilderContext)
export function useAppBuilder() {
  const context = useContext(AppBuilderContext);
  if (!context) {
    throw new Error("useAppBuilder must be used inside an AppBuilderProvider");
  }
  return context;
}
```

---

## Wiring the Providers — Route Segment Layouts

Each Context provider must wrap its route segment using a `layout.jsx` file. This is the correct Next.js App Router pattern — it means the provider is applied to the route and all its children (form page + result page) automatically.

### `src/app/experience/webpage/layout.jsx`

```jsx
// layout.jsx — Wraps the entire /experience/webpage route segment with WebPageProvider.
// This makes WebPage form state available to both the form page and the result page.

"use client";

import { WebPageProvider } from "@/context/WebPageContext";

export default function WebPageLayout({ children }) {
  return <WebPageProvider>{children}</WebPageProvider>;
}
```

### `src/app/experience/app/layout.jsx`

```jsx
// layout.jsx — Wraps the entire /experience/app route segment with AppBuilderProvider.
// This makes App Builder form state available to both the form page and the result page.

"use client";

import { AppBuilderProvider } from "@/context/AppBuilderContext";

export default function AppLayout({ children }) {
  return <AppBuilderProvider>{children}</AppBuilderProvider>;
}
```

---

## Result Page Redirect Guard

Both result pages must check that the form has been filled before rendering. If a student navigates directly to a result URL without going through the form, they should be redirected to `/select`.

The redirect logic is handled inside each result page component (built in later feature specs), not in the Context itself. The check is simply:

```js
// Example redirect guard used inside a result page
// If the name field is empty, the form was never filled — send them back to select
if (!formData.name) {
  redirect("/select");
}
```

For `AppBuilderContext`, the equivalent guard checks `formData.appTitle`.

> The actual redirect implementation belongs in `exp1-result.feature.md` and `exp2-result.feature.md`. It is documented here for awareness only.

---

## Acceptance Criteria

- [ ] `src/context/WebPageContext.jsx` exists and exports `WebPageProvider` and `useWebPage`
- [ ] `src/context/AppBuilderContext.jsx` exists and exports `AppBuilderProvider` and `useAppBuilder`
- [ ] Both files include the `"use client"` directive at the top
- [ ] Both files have a one-line comment explaining their purpose
- [ ] `updateField` correctly updates a single field without overwriting the rest of the state
- [ ] `updateMessage` correctly updates a single index in the messages array
- [ ] Both custom hooks throw a descriptive error if used outside their provider
- [ ] `src/app/experience/webpage/layout.jsx` wraps children in `WebPageProvider`
- [ ] `src/app/experience/app/layout.jsx` wraps children in `AppBuilderProvider`
- [ ] Both layout files include the `"use client"` directive
- [ ] No console errors when either layout renders
