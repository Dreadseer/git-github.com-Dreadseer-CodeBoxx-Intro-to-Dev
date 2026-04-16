// AppFormStep3.jsx — Step 3 of the App Builder.
// Lets the student pick a theme color. A default is pre-selected.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ColorSwatchPicker from "@/components/shared/ColorSwatchPicker";

export default function AppFormStep3({ onNext }) {
  const { formData, updateField } = useAppBuilder();

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Color picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">
          Pick your color
        </label>
        <p className="text-xs text-gray-500">
          This will be the color of your app's button and header.
        </p>
        <ColorSwatchPicker
          selectedColor={formData.themeColor}
          onChange={(key) => updateField("themeColor", key)}
        />
      </div>

      {/* Always enabled — color always has a default */}
      <PrimaryButton label="See My App →" onClick={onNext} />
    </div>
  );
}
