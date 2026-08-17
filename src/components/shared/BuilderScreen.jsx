// BuilderScreen.jsx — Shared mission flow for both build paths.
// Owns step progression, module placement, micro-reward toasts, the preview
// reaction ping, and the launch sequence. The two experience pages just supply
// their step components, preview, and code generator.

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBuilder } from "@/context/BuilderContext";
import { WIDGET_TYPES } from "@/data/widgets";
import PageShell from "@/components/shared/PageShell";
import MissionHeader from "@/components/shared/MissionHeader";
import BuildProgress from "@/components/shared/BuildProgress";
import WidgetPanel from "@/components/shared/WidgetPanel";
import WidgetPlacer from "@/components/shared/WidgetPlacer";
import WidgetEditor from "@/components/shared/WidgetEditor";
import BuildToast from "@/components/shared/BuildToast";
import LaunchSequence from "@/components/shared/LaunchSequence";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import { getHighlightKey } from "@/utils/getHighlightKey";

// Fields where a change means "the user picked something" rather than typing —
// these trigger the preview reaction ring
const SELECTION_FIELDS = ["themeColor", "avatar"];

export default function BuilderScreen({
  stepComponents,
  PreviewComponent,
  generateCode,
  getProjectName,
}) {
  const router = useRouter();
  const {
    experience,
    formData,
    decisions,
    buildPercent,
    addWidget,
    removeWidget,
    updateWidget,
    moveWidget,
  } = useBuilder();

  const generatedCode = generateCode(formData);
  const highlightKey = getHighlightKey(formData.lastChanged, experience.key);

  // Current build mission (0-based index into stepComponents).
  // Persisted so a refresh or locked phone returns the student to the same mission.
  const [stepIndex, setStepIndexState] = useState(0);
  const stepStorageKey = `${experience.storageKey}_step`;

  useEffect(() => {
    try {
      const saved = parseInt(sessionStorage.getItem(stepStorageKey), 10);
      if (saved >= 0 && saved < stepComponents.length) {
        setStepIndexState(saved);
      }
    } catch {
      // Storage unavailable — start at the first mission
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepStorageKey]);

  function setStepIndex(index) {
    setStepIndexState(index);
    try {
      sessionStorage.setItem(stepStorageKey, String(index));
    } catch {
      // Ignore storage errors
    }
  }

  // Module being placed — set when a tile is tapped, cleared after placement or cancel
  const [pendingWidgetKey, setPendingWidgetKey] = useState(null);

  // Module currently open in the editor — set when a canvas item is tapped
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);

  // True while a module tile is being dragged — reveals canvas drop hints
  const [isDragging, setIsDragging] = useState(false);

  // Micro-reward toast text
  const [toast, setToast] = useState("");

  // True once the final mission completes — shows the launch sequence
  const [launching, setLaunching] = useState(false);

  // Replays the preview reaction ring when a selection-type choice lands
  const [pingKey, setPingKey] = useState(0);
  const lastDecisionCount = useRef(decisions);

  useEffect(() => {
    if (decisions === lastDecisionCount.current) return;
    lastDecisionCount.current = decisions;
    const isSelection =
      (typeof formData.lastChanged === "string" &&
        SELECTION_FIELDS.includes(formData.lastChanged)) ||
      (typeof formData.lastChanged === "object" && formData.lastChanged !== null);
    if (isSelection) {
      setPingKey(decisions);
    }
  }, [decisions, formData.lastChanged]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const missions = experience.missions;
  const mission = missions[stepIndex];
  const StepComponent = stepComponents[stepIndex];
  const isFinalStep = stepIndex === stepComponents.length - 1;

  // Called by each mission's primary button
  function handleNext() {
    if (!isFinalStep) {
      setToast(`MISSION 0${stepIndex + 2} COMPLETE`);
      setStepIndex(stepIndex + 1);
    } else {
      setLaunching(true);
    }
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  }

  // Called when a module tile is tapped — opens the placement sheet
  function handleWidgetSelect(widgetKey) {
    setPendingWidgetKey(widgetKey);
  }

  function installWidget(widgetKey, position) {
    addWidget(widgetKey, position);
    const def = WIDGET_TYPES.find((w) => w.key === widgetKey);
    setToast(`MODULE INSTALLED — ${def?.label?.toUpperCase() || "MODULE"}`);
  }

  // Drag-and-drop placement straight onto a canvas slot
  function handleWidgetDrop(widgetKey, position) {
    installWidget(widgetKey, position);
    setIsDragging(false);
  }

  // Placement confirmed from the bottom sheet
  function handlePlacerConfirm(widgetKey, position) {
    installWidget(widgetKey, position);
    setPendingWidgetKey(null);
  }

  return (
    <PageShell>
      <BuildToast message={toast} />

      {/* Launch sequence overlay — the payoff between last mission and result */}
      {launching && (
        <LaunchSequence
          projectName={getProjectName(formData)}
          onLaunch={() => router.push(experience.resultRoute)}
        />
      )}

      {/* Mission 01 was path selection, so build missions start at 02 */}
      <MissionHeader
        mission={`MISSION 0${stepIndex + 2}`}
        title={mission.title}
        backHref={stepIndex === 0 ? "/select" : undefined}
        onBack={stepIndex > 0 ? handleBack : undefined}
      />

      <BuildProgress
        missions={missions}
        currentIndex={stepIndex}
        percent={buildPercent}
        decisions={decisions}
      />

      {/* Current mission form */}
      <div key={stepIndex} className="animate-rise">
        <StepComponent
          onNext={handleNext}
          nextLabel={isFinalStep ? "LAUNCH PROJECT ⌁" : "Next →"}
        />
      </div>

      {/* Live preview — the creation forming in real time */}
      <div className="mt-8 relative">
        <p className="sys text-[10px] text-center text-fg-dim mb-2">
          LIVE PREVIEW — YOUR CHOICES CHANGE THIS
        </p>
        <div className="relative flex justify-center">
          <PreviewComponent
            onDrop={handleWidgetDrop}
            onRemove={removeWidget}
            onEdit={setSelectedWidgetId}
            selectedWidgetId={selectedWidgetId}
            showHints={isDragging}
          />
          {/* Reaction ring overlay — remounts to replay on each selection */}
          {pingKey > 0 && (
            <div
              key={pingKey}
              aria-hidden="true"
              className="absolute inset-0 rounded-3xl animate-preview-ping pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Module tray */}
      <WidgetPanel
        onSelect={handleWidgetSelect}
        onDragStateChange={setIsDragging}
      />

      {/* Module editor — shown inline when an installed module is selected */}
      {selectedWidgetId && (
        <WidgetEditor
          widget={formData.widgets.find((w) => w.id === selectedWidgetId)}
          onUpdate={updateWidget}
          onClose={() => setSelectedWidgetId(null)}
          onMove={moveWidget}
        />
      )}

      {/* Module placement sheet — after tapping a module tile */}
      {pendingWidgetKey && (
        <WidgetPlacer
          widgetKey={pendingWidgetKey}
          onConfirm={handlePlacerConfirm}
          onCancel={() => setPendingWidgetKey(null)}
        />
      )}

      {/* Live source — the code forming alongside the preview */}
      <div className="mt-6">
        <SeeTheCodePanel
          code={generatedCode}
          highlightKey={highlightKey}
          defaultOpen={true}
        />
      </div>
    </PageShell>
  );
}
