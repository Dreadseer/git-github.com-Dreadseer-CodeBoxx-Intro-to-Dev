// WebPageFormStep3.jsx — Step 3 of the Web Page Builder.
// Lets the student pick an emoji avatar icon. Optional — a default is pre-selected.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import PrimaryButton from "@/components/shared/PrimaryButton";
import AvatarPicker from "@/components/shared/AvatarPicker";

export default function WebPageFormStep3({ onNext }) {
  const { formData, updateField } = useWebPage();

  return (
    <div className="flex flex-col gap-5 mt-2">

      {/* Avatar picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Pick your icon</label>
        <p className="text-xs text-gray-500">
          This will appear on your personal page.
        </p>
        <AvatarPicker
          selectedAvatar={formData.avatar}
          onChange={(key) => updateField("avatar", key)}
        />
      </div>

      {/* Always enabled — avatar selection is optional */}
      <PrimaryButton label="See My Page →" onClick={onNext} />
    </div>
  );
}
