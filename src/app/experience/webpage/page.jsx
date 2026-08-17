// page.jsx — Web Page Builder multi-step form (Experience 1).
// Collects name, dream job, bio, theme color, and avatar across 3 steps. Supports widget placement.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWebPage } from "@/context/WebPageContext";
import PageShell from "@/components/shared/PageShell";
import StepHeader from "@/components/shared/StepHeader";
import StepProgress from "@/components/shared/StepProgress";
import WidgetPanel from "@/components/shared/WidgetPanel";
import WidgetPlacer from "@/components/shared/WidgetPlacer";
import WidgetEditor from "@/components/shared/WidgetEditor";
import WebPageFormStep1 from "@/components/webpage/WebPageFormStep1";
import WebPageFormStep2 from "@/components/webpage/WebPageFormStep2";
import WebPageFormStep3 from "@/components/webpage/WebPageFormStep3";
import WebPageLivePreview from "@/components/webpage/WebPageLivePreview";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import { generateWebPageCode } from "@/utils/generateWebPageCode";
import { getHighlightKey } from "@/utils/getHighlightKey";

export default function WebPageBuilderPage() {
  const router = useRouter();
  const { formData, addWidget, removeWidget, updateWidget, moveWidget } = useWebPage();
  const generatedCode = generateWebPageCode(formData);
  const highlightKey = getHighlightKey(formData.lastChanged, "webpage");

  // Tracks which step (1, 2, or 3) the student is currently on
  const [step, setStep] = useState(1);

  // Widget being placed — set when a tile is tapped, cleared after placement or cancel
  const [pendingWidgetKey, setPendingWidgetKey] = useState(null);

  // Widget currently open in the editor — set when a canvas item is tapped
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);

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

  // Called when a widget tile is tapped — opens the WidgetPlacer
  function handleWidgetSelect(widgetKey) {
    setPendingWidgetKey(widgetKey);
  }

  // Called when drag-and-drop places a widget directly onto a canvas slot
  function handleWidgetDrop(widgetKey, position) {
    addWidget(widgetKey, position);
  }

  // Called when WidgetPlacer confirms a placement slot
  function handlePlacerConfirm(widgetKey, position) {
    addWidget(widgetKey, position);
    setPendingWidgetKey(null);
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
        <WebPageLivePreview
          onDrop={handleWidgetDrop}
          onRemove={removeWidget}
          onEdit={setSelectedWidgetId}
          selectedWidgetId={selectedWidgetId}
        />
      </div>

      {/* Widget panel — horizontal tray of available widget tiles */}
      <WidgetPanel onSelect={handleWidgetSelect} />

      {/* Widget editor — shown inline when a placed widget is selected */}
      {selectedWidgetId && (
        <WidgetEditor
          widget={formData.widgets.find((w) => w.id === selectedWidgetId)}
          onUpdate={updateWidget}
          onClose={() => setSelectedWidgetId(null)}
          onMove={moveWidget}
        />
      )}

      {/* Widget placer — bottom sheet shown after tapping a widget tile */}
      {pendingWidgetKey && (
        <WidgetPlacer
          widgetKey={pendingWidgetKey}
          onConfirm={handlePlacerConfirm}
          onCancel={() => setPendingWidgetKey(null)}
        />
      )}

      {/* Live code panel — open by default so students see their code updating */}
      <div className="mt-6">
        <p className="text-xs text-center text-gray-400 mb-2">
          Your code updates as you build
        </p>
        <SeeTheCodePanel
          code={generatedCode}
          highlightKey={highlightKey}
          defaultOpen={true}
        />
      </div>
    </PageShell>
  );
}
