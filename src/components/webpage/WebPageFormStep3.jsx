// WebPageFormStep3.jsx — Mission 04 (Creator Page): Choose your mark.
// Emoji avatar selection. Optional — a default is pre-selected.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import AvatarPicker from "@/components/shared/AvatarPicker";

export default function WebPageFormStep3({ onNext, nextLabel = "LAUNCH PROJECT ⌁" }) {
  const { formData, updateField } = useBuilder();

  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-fg-mid">Pick your icon</label>
        <p className="text-xs text-fg-dim">This will appear on your page.</p>
        <AvatarPicker
          selectedAvatar={formData.avatar}
          onChange={(key) => updateField("avatar", key)}
        />
      </div>

      {/* Always enabled — avatar selection is optional */}
      <PrimaryButton label={nextLabel} onClick={onNext} />
    </div>
  );
}
