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
