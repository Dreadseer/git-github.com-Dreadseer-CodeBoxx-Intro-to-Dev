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
import WebPageLivePreview from "@/components/webpage/WebPageLivePreview";

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

      {/* Live preview — updates in real time as the student fills in the form */}
      <div className="mt-8">
        <p className="text-xs text-center text-gray-400 mb-2">Live preview</p>
        <WebPageLivePreview />
      </div>
    </PageShell>
  );
}
