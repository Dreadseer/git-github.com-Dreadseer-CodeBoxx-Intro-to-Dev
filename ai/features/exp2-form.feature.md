# 📝 FEATURE SPEC — Experience 2: App Builder Form

> **Read `ai-spec.md` first.** This file defines only what is specific to the Experience 2 form.
> The global spec overrides anything here in case of conflict.

---

## Purpose

This feature builds the multi-step form that collects the student's inputs for their mini interactive app. It follows the same 3-step pattern as Experience 1 — local `useState` tracks the current step, and `AppBuilderContext` holds all form values.

---

## Route

| Route | File |
|---|---|
| `/experience/app` | `src/app/experience/app/page.jsx` |

---

## Step Flow

```
Step 1 — App Title + Button Label
    ↓ (Next)
Step 2 — Three Messages
    ↓ (Next)
Step 3 — Theme Color
    ↓ (See My App →)
/experience/app/result
```

- Current step is tracked with `useState` local to `page.jsx`
- Back navigation within steps uses `setStep` — not the browser back button
- Completing Step 3 uses `router.push("/experience/app/result")`

---

## Page File

### `src/app/experience/app/page.jsx`

```jsx
// page.jsx — App Builder multi-step form (Experience 2).
// Collects app title, button label, three messages, and theme color across 3 steps.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/shared/PageShell";
import StepHeader from "@/components/shared/StepHeader";
import StepProgress from "@/components/shared/StepProgress";
import AppFormStep1 from "@/components/app/AppFormStep1";
import AppFormStep2 from "@/components/app/AppFormStep2";
import AppFormStep3 from "@/components/app/AppFormStep3";
import AppLivePreview from "@/components/app/AppLivePreview";

export default function AppBuilderPage() {
  const router = useRouter();

  // Tracks which step (1, 2, or 3) the student is currently on
  const [step, setStep] = useState(1);

  // Step titles shown in the StepHeader
  const stepTitles = {
    1: "Name your app",
    2: "Write your messages",
    3: "Pick your style",
  };

  // Called by each step's Next button to advance
  function handleNext() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/experience/app/result");
    }
  }

  // Called by the back arrow to go to the previous step
  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  return (
    <PageShell>
      {/* Back arrow goes to /select on step 1, previous step otherwise */}
      <StepHeader
        title={stepTitles[step]}
        backHref={step === 1 ? "/select" : undefined}
        onBack={step > 1 ? handleBack : undefined}
      />

      {/* Dot progress indicator */}
      <StepProgress totalSteps={3} currentStep={step} />

      {/* Render the correct step component */}
      {step === 1 && <AppFormStep1 onNext={handleNext} />}
      {step === 2 && <AppFormStep2 onNext={handleNext} />}
      {step === 3 && <AppFormStep3 onNext={handleNext} />}

      {/* Live preview — visible on all steps */}
      <div className="mt-8">
        <p className="text-xs text-center text-gray-400 mb-2">Live preview</p>
        <AppLivePreview />
      </div>
    </PageShell>
  );
}
```

---

## Step Components

All step components live in `src/components/app/`. Each receives an `onNext` prop. Each reads from and writes to `AppBuilderContext` via `useAppBuilder()`.

---

### Step 1 — `AppFormStep1`

**Collects:** `appTitle`, `buttonLabel`

**Fields:**
| Field | Label | Placeholder | Context Key |
|---|---|---|---|
| Text input | `"App name"` | `"e.g. My Mood Button"` | `appTitle` |
| Text input | `"Button label"` | `"e.g. Tap Me"` | `buttonLabel` |

**Next button:** Label `"Next →"` — disabled if either field is empty

**File: `src/components/app/AppFormStep1.jsx`**
```jsx
// AppFormStep1.jsx — Step 1 of the App Builder.
// Collects the app title and button label.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";

export default function AppFormStep1({ onNext }) {
  const { formData, updateField } = useAppBuilder();

  const isComplete =
    formData.appTitle.trim() !== "" && formData.buttonLabel.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* App title input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">App name</label>
        <input
          type="text"
          value={formData.appTitle}
          onChange={(e) => updateField("appTitle", e.target.value)}
          placeholder="e.g. My Mood Button"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Button label input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Button label</label>
        <input
          type="text"
          value={formData.buttonLabel}
          onChange={(e) => updateField("buttonLabel", e.target.value)}
          placeholder="e.g. Tap Me"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <PrimaryButton label="Next →" onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
```

---

### Step 2 — `AppFormStep2`

**Collects:** `messages[0]`, `messages[1]`, `messages[2]`

**Fields:** Three separate text inputs, one per message, labeled Message 1 / 2 / 3

| Field | Label | Placeholder | Update Method |
|---|---|---|---|
| Text input | `"Message 1"` | `"e.g. You're doing great!"` | `updateMessage(0, value)` |
| Text input | `"Message 2"` | `"e.g. Keep it up!"` | `updateMessage(1, value)` |
| Text input | `"Message 3"` | `"e.g. You've got this!"` | `updateMessage(2, value)` |

**Next button:** Label `"Next →"` — disabled if any of the three messages is empty

**File: `src/components/app/AppFormStep2.jsx`**
```jsx
// AppFormStep2.jsx — Step 2 of the App Builder.
// Collects the three messages that will cycle when the button is tapped.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";

export default function AppFormStep2({ onNext }) {
  const { formData, updateMessage } = useAppBuilder();

  // All three messages must have content before proceeding
  const isComplete = formData.messages.every((msg) => msg.trim() !== "");

  const placeholders = [
    "e.g. You're doing great!",
    "e.g. Keep it up!",
    "e.g. You've got this!",
  ];

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Render one input per message */}
      {formData.messages.map((message, index) => (
        <div key={index} className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Message {index + 1}
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => updateMessage(index, e.target.value)}
            placeholder={placeholders[index]}
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      ))}

      <PrimaryButton label="Next →" onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
```

---

### Step 3 — `AppFormStep3`

**Collects:** `themeColor`

**Fields:**
| Field | Label | Context Key |
|---|---|---|
| ColorSwatchPicker | `"Pick your color"` | `themeColor` |

**Note:** A default color is already set in context. The Next button is always enabled.

**Next button:** Label `"See My App →"` — always enabled

**File: `src/components/app/AppFormStep3.jsx`**
```jsx
// AppFormStep3.jsx — Step 3 of the App Builder.
// Lets the student pick a theme color. A default is pre-selected.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ColorSwatchPicker from "@/components/shared/ColorSwatchPicker";

export default function AppFormStep3({ onNext }) {
  const { formData, updateField } = useAppBuilder();

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Color picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Pick your color
        </label>
        <p className="text-xs text-gray-500">
          This will be the color of your app's button and header.
        </p>
        <ColorSwatchPicker
          selectedColor={formData.themeColor}
          onChange={(key) => updateField("themeColor", key)}
        />
      </div>

      {/* Always enabled — color always has a default */}
      <PrimaryButton label="See My App →" onClick={onNext} />
    </div>
  );
}
```

---

## Validation Rules Summary

| Step | Required Fields | Button Disabled When |
|---|---|---|
| Step 1 | `appTitle`, `buttonLabel` | Either field is empty |
| Step 2 | `messages[0]`, `messages[1]`, `messages[2]` | Any message is empty |
| Step 3 | None | Never disabled |

---

## Acceptance Criteria

- [ ] Page loads at `http://localhost:3000/experience/app` with no errors
- [ ] Step 1 renders with app title and button label inputs
- [ ] Step 2 renders with three separate message inputs
- [ ] Step 3 renders with the color swatch picker
- [ ] `StepProgress` dots update correctly as steps advance
- [ ] `StepHeader` title changes correctly at each step
- [ ] Back arrow on Step 1 navigates to `/select`
- [ ] Back arrow on Steps 2 and 3 returns to the previous step
- [ ] Next button on Step 1 disabled when either field is empty
- [ ] Next button on Step 2 disabled when any message is empty
- [ ] Next button on Step 3 is always enabled
- [ ] Completing Step 3 navigates to `/experience/app/result`
- [ ] All field values persist in context when navigating between steps
- [ ] `AppLivePreview` is visible below the step form on all steps
- [ ] No console errors or warnings
- [ ] All inputs use `text-base` or larger to prevent iOS Safari auto-zoom
