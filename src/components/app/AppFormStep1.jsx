// AppFormStep1.jsx — Mission 02 (Interactive App): Concept.
// Collects the app title and button label.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import FormField from "@/components/shared/FormField";

export default function AppFormStep1({ onNext, nextLabel = "Next →" }) {
  const { formData, updateField } = useBuilder();

  const isComplete =
    formData.appTitle.trim() !== "" && formData.buttonLabel.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">
      <FormField
        label="App name"
        value={formData.appTitle}
        onChange={(value) => updateField("appTitle", value)}
        placeholder="e.g. My Mood Button"
      />
      <FormField
        label="Button label"
        value={formData.buttonLabel}
        onChange={(value) => updateField("buttonLabel", value)}
        placeholder="e.g. Tap Me"
      />
      <PrimaryButton label={nextLabel} onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
