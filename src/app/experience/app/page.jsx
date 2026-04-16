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
