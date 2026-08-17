// AppFormStep2.jsx — Mission 03 (Interactive App): Content.
// Collects the three messages that cycle when the button is tapped.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import FormField from "@/components/shared/FormField";

export default function AppFormStep2({ onNext, nextLabel = "Next →" }) {
  const { formData, updateMessage } = useBuilder();

  // All three messages must have content before proceeding
  const isComplete = formData.messages.every((msg) => msg.trim() !== "");

  const placeholders = [
    "e.g. You're doing great!",
    "e.g. Keep it up!",
    "e.g. You've got this!",
  ];

  return (
    <div className="flex flex-col gap-5 mt-2">
      {formData.messages.map((message, index) => (
        <FormField
          key={index}
          label={`Message ${index + 1}`}
          value={message}
          onChange={(value) => updateMessage(index, value)}
          placeholder={placeholders[index]}
        />
      ))}
      <PrimaryButton label={nextLabel} onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
