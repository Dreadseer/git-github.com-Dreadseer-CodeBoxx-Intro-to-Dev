// AppFormStep3.jsx — Mission 04 (Interactive App): Style.
// Theme color selection. A default is pre-selected.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ColorSwatchPicker from "@/components/shared/ColorSwatchPicker";

export default function AppFormStep3({ onNext, nextLabel = "LAUNCH PROJECT ⌁" }) {
  const { formData, updateField } = useBuilder();

  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-fg-mid">Pick your color</label>
        <p className="text-xs text-fg-dim">
          This will be the color of your app&apos;s button and header.
        </p>
        <ColorSwatchPicker
          selectedColor={formData.themeColor}
          onChange={(key) => updateField("themeColor", key)}
        />
      </div>

      {/* Always enabled — color always has a default */}
      <PrimaryButton label={nextLabel} onClick={onNext} />
    </div>
  );
}
