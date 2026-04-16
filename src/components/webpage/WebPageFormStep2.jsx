// WebPageFormStep2.jsx — Step 2 of the Web Page Builder.
// Collects the student's bio and theme color choice.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ColorSwatchPicker from "@/components/shared/ColorSwatchPicker";

export default function WebPageFormStep2({ onNext }) {
  const { formData, updateField } = useWebPage();

  // Next button is disabled until the bio has content
  const isComplete = formData.bio.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Bio textarea */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">A little about you</label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          placeholder="e.g. I love gaming and want to build the next big thing."
          rows={3}
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />
      </div>

      {/* Color picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Pick your color</label>
        <ColorSwatchPicker
          selectedColor={formData.themeColor}
          onChange={(key) => updateField("themeColor", key)}
        />
      </div>

      <PrimaryButton label="Next →" onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
