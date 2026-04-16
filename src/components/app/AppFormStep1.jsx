// AppFormStep1.jsx — Step 1 of the App Builder.
// Collects the app title and button label.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";

export default function AppFormStep1({ onNext }) {
  const { formData, updateField } = useAppBuilder();

  const isComplete =
    formData.appTitle.trim() !== "" && formData.buttonLabel.trim() !== "";

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* App title input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">App name</label>
        <input
          type="text"
          value={formData.appTitle}
          onChange={(e) => updateField("appTitle", e.target.value)}
          placeholder="e.g. My Mood Button"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Button label input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Button label</label>
        <input
          type="text"
          value={formData.buttonLabel}
          onChange={(e) => updateField("buttonLabel", e.target.value)}
          placeholder="e.g. Tap Me"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <PrimaryButton label="Next →" onClick={onNext} disabled={!isComplete} />
    </div>
  );
}
