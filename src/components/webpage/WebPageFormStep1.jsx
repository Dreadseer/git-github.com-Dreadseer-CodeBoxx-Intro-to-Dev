// WebPageFormStep1.jsx — Mission 02 (Creator Page): Identity.
// Collects the student's name and dream job.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import FormField from "@/components/shared/FormField";

export default function WebPageFormStep1({ onNext, nextLabel = "Next →" }) {
  const { formData, updateField } = useBuilder();

  // Next button is disabled until both fields have content
  const isComplete = formData.name.trim() !== "" && formData.dreamJob.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">
      <FormField
        label="Your name"
        value={formData.name}
        onChange={(value) => updateField("name", value)}
        placeholder="e.g. Alex"
      />
      <FormField
        label="Your dream job"
        value={formData.dreamJob}
        onChange={(value) => updateField("dreamJob", value)}
        placeholder="e.g. Game Developer"
      />
      <PrimaryButton label={nextLabel} onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
