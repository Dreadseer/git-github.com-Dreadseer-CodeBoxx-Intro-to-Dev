# 📝 FEATURE SPEC — Experience 1: Web Page Builder Form

> **Read `ai-spec.md` first.** This file defines only what is specific to the Experience 1 form.
> The global spec overrides anything here in case of conflict.

---

## Purpose

This feature builds the multi-step form that collects the student's information for their personal landing page. It is a 3-step flow managed by local `useState` for the current step number, with all form field values stored in `WebPageContext`.

---

## Route

| Route | File |
|---|---|
| `/experience/webpage` | `src/app/experience/webpage/page.jsx` |

---

## Step Flow

```
Step 1 — Name + Dream Job
    ↓ (Next)
Step 2 — Bio + Theme Color
    ↓ (Next)
Step 3 — Avatar Picker
    ↓ (See My Page →)
/experience/webpage/result
```

- The current step is tracked with `useState` local to `page.jsx`
- Navigating back within steps uses `setStep` — it does NOT use the browser back button
- Navigating forward from Step 3 uses `router.push("/experience/webpage/result")`

---

## Page File

### `src/app/experience/webpage/page.jsx`

```jsx
// page.jsx — Web Page Builder multi-step form (Experience 1).
// Collects name, dream job, bio, theme color, and avatar across 3 steps.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/shared/PageShell";
import StepHeader from "@/components/shared/StepHeader";
import StepProgress from "@/components/shared/StepProgress";
import WebPageFormStep1 from "@/components/webpage/WebPageFormStep1";
import WebPageFormStep2 from "@/components/webpage/WebPageFormStep2";
import WebPageFormStep3 from "@/components/webpage/WebPageFormStep3";

export default function WebPageBuilderPage() {
  const router = useRouter();

  // Tracks which step (1, 2, or 3) the student is currently on
  const [step, setStep] = useState(1);

  // Step titles shown in the StepHeader
  const stepTitles = {
    1: "Tell us about you",
    2: "Pick your style",
    3: "Choose your icon",
  };

  // Called by each step's Next button to advance to the next step
  function handleNext() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Step 3 complete — navigate to the result screen
      router.push("/experience/webpage/result");
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
      {/* Back arrow navigates to /select on step 1, or to the previous step otherwise */}
      <StepHeader
        title={stepTitles[step]}
        backHref={step === 1 ? "/select" : undefined}
        onBack={step > 1 ? handleBack : undefined}
      />

      {/* Dot progress indicator */}
      <StepProgress totalSteps={3} currentStep={step} />

      {/* Render the correct form step component based on current step */}
      {step === 1 && <WebPageFormStep1 onNext={handleNext} />}
      {step === 2 && <WebPageFormStep2 onNext={handleNext} />}
      {step === 3 && <WebPageFormStep3 onNext={handleNext} />}
    </PageShell>
  );
}
```

---

## Step Components

All step components live in `src/components/webpage/`. Each receives an `onNext` prop which is the function to call when the student taps the Next/Continue button.

Each step reads from and writes to `WebPageContext` using the `useWebPage()` hook.

---

### Step 1 — `WebPageFormStep1`

**Collects:** `name`, `dreamJob`

**Fields:**
| Field | Label | Placeholder | Context Key |
|---|---|---|---|
| Text input | `"Your name"` | `"e.g. Alex"` | `name` |
| Text input | `"Your dream job"` | `"e.g. Game Developer"` | `dreamJob` |

**Next button:** Label `"Next →"` — disabled if either field is empty

**File: `src/components/webpage/WebPageFormStep1.jsx`**
```jsx
// WebPageFormStep1.jsx — Step 1 of the Web Page Builder.
// Collects the student's name and dream job.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import PrimaryButton from "@/components/shared/PrimaryButton";

export default function WebPageFormStep1({ onNext }) {
  const { formData, updateField } = useWebPage();

  // Next button is disabled until both fields have content
  const isComplete = formData.name.trim() !== "" && formData.dreamJob.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Name input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Your name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="e.g. Alex"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Dream job input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Your dream job</label>
        <input
          type="text"
          value={formData.dreamJob}
          onChange={(e) => updateField("dreamJob", e.target.value)}
          placeholder="e.g. Game Developer"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <PrimaryButton label="Next →" onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
```

---

### Step 2 — `WebPageFormStep2`

**Collects:** `bio`, `themeColor`

**Fields:**
| Field | Label | Placeholder | Context Key |
|---|---|---|---|
| Textarea | `"A little about you"` | `"e.g. I love gaming and want to build the next big thing."` | `bio` |
| ColorSwatchPicker | `"Pick your color"` | — | `themeColor` |

**Next button:** Label `"Next →"` — disabled if `bio` is empty (color always has a default)

**File: `src/components/webpage/WebPageFormStep2.jsx`**
```jsx
// WebPageFormStep2.jsx — Step 2 of the Web Page Builder.
// Collects the student's bio and theme color choice.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ColorSwatchPicker from "@/components/shared/ColorSwatchPicker";

export default function WebPageFormStep2({ onNext }) {
  const { formData, updateField } = useWebPage();

  // Next button is disabled until the bio has content
  const isComplete = formData.bio.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Bio textarea */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">A little about you</label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          placeholder="e.g. I love gaming and want to build the next big thing."
          rows={3}
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />
      </div>

      {/* Color picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Pick your color</label>
        <ColorSwatchPicker
          selectedColor={formData.themeColor}
          onChange={(key) => updateField("themeColor", key)}
        />
      </div>

      <PrimaryButton label="Next →" onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
```

---

### Step 3 — `WebPageFormStep3`

**Collects:** `avatar`

**Fields:**
| Field | Label | Context Key |
|---|---|---|
| AvatarPicker | `"Pick your icon"` | `avatar` |

**Note:** Avatar is optional — the Next button is always enabled on this step regardless of selection. A default avatar is already set in context.

**Next button:** Label `"See My Page →"` — always enabled

**File: `src/components/webpage/WebPageFormStep3.jsx`**
```jsx
// WebPageFormStep3.jsx — Step 3 of the Web Page Builder.
// Lets the student pick an emoji avatar icon. Optional — a default is pre-selected.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import AvatarPicker from "@/components/shared/AvatarPicker";

export default function WebPageFormStep3({ onNext }) {
  const { formData, updateField } = useWebPage();

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Avatar picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Pick your icon</label>
        <p className="text-xs text-gray-500">
          This will appear on your personal page.
        </p>
        <AvatarPicker
          selectedAvatar={formData.avatar}
          onChange={(key) => updateField("avatar", key)}
        />
      </div>

      {/* Always enabled — avatar selection is optional */}
      <PrimaryButton label="See My Page →" onClick={onNext} />
    </div>
  );
}
```

---

## Validation Rules Summary

| Step | Required Fields | Button Disabled When |
|---|---|---|
| Step 1 | `name`, `dreamJob` | Either field is empty |
| Step 2 | `bio` | `bio` is empty |
| Step 3 | None | Never disabled |

---

## Acceptance Criteria

- [ ] Page loads at `http://localhost:3000/experience/webpage` with no errors
- [ ] Step 1 renders with name and dream job inputs
- [ ] Step 2 renders with bio textarea and color swatches
- [ ] Step 3 renders with the avatar grid
- [ ] `StepProgress` dots update correctly as steps advance
- [ ] `StepHeader` title changes correctly at each step
- [ ] Back arrow on Step 1 navigates to `/select`
- [ ] Back arrow on Steps 2 and 3 returns to the previous step (not browser history)
- [ ] Next button on Step 1 is disabled when either field is empty
- [ ] Next button on Step 2 is disabled when bio is empty
- [ ] Next button on Step 3 is always enabled
- [ ] Completing Step 3 navigates to `/experience/webpage/result`
- [ ] All field values persist in context when navigating between steps
- [ ] No console errors or warnings
- [ ] All inputs use `text-base` or larger to prevent iOS Safari auto-zoom
