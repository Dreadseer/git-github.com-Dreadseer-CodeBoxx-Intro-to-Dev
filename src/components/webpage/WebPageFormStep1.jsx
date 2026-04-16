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
