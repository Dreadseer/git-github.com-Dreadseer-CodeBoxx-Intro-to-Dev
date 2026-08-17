// WebPageFormStep2.jsx — Mission 03 (Creator Page): Style & story.
// Collects the student's bio and theme color choice.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import FormField from "@/components/shared/FormField";
import ColorSwatchPicker from "@/components/shared/ColorSwatchPicker";

export default function WebPageFormStep2({ onNext, nextLabel = "Next →" }) {
  const { formData, updateField } = useBuilder();

  // Next button is disabled until the bio has content
  const isComplete = formData.bio.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">
      <FormField
        label="A little about you"
        value={formData.bio}
        onChange={(value) => updateField("bio", value)}
        placeholder="e.g. I love gaming and want to build the next big thing."
        multiline
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-fg-mid">Pick your color</label>
        <ColorSwatchPicker
          selectedColor={formData.themeColor}
          onChange={(key) => updateField("themeColor", key)}
        />
      </div>

      <PrimaryButton label={nextLabel} onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
