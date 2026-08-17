// WebPageResultCard.jsx — Full-width display of the student's finished personal landing page.
// Renders base content AND all installed modules at their slot positions.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import { getTheme } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";
import { SlotWidgets } from "@/components/shared/WidgetResultRenderer";

export default function WebPageResultCard() {
  const { formData } = useBuilder();

  const theme = getTheme(formData.themeColor);
  const avatarEmoji =
    AVATAR_OPTIONS.find((a) => a.key === formData.avatar)?.emoji || "🚀";
  const widgets = formData.widgets || [];

  return (
    <div className="w-full rounded-2xl overflow-hidden mt-4 mb-6 bg-white shadow-[0_0_50px_rgba(245,197,24,0.1)] animate-pop">

      {/* TOP slot modules */}
      <SlotWidgets widgets={widgets} slot="top" />

      {/* Colored header band with avatar */}
      <div
        className="flex items-center justify-center h-20"
        style={{ backgroundColor: theme.hex }}
      >
        <span className="text-4xl">{avatarEmoji}</span>
      </div>

      {/* AFTER_HEADER slot modules */}
      <SlotWidgets widgets={widgets} slot="after_header" />

      {/* Card body — base content */}
      <div className="flex flex-col items-center px-6 py-5 bg-white">

        {/* Student name */}
        <p
          className="text-2xl font-bold text-center"
          style={{ color: theme.hex }}
        >
          {formData.name}
        </p>

        {/* Dream job */}
        <p className="text-sm text-gray-500 text-center mt-1">
          {formData.dreamJob}
        </p>

        {/* Divider */}
        <div
          className="w-12 h-0.5 my-4 rounded-full"
          style={{ backgroundColor: theme.hex }}
        />

        {/* Bio */}
        <p className="text-sm text-gray-600 text-center leading-relaxed">
          {formData.bio}
        </p>

      </div>

      {/* BOTTOM slot modules */}
      <SlotWidgets widgets={widgets} slot="bottom" />

      {/* Footer tag */}
      <p className="text-xs text-gray-400 text-center py-4">
        Made with CodeBoxx
      </p>

    </div>
  );
}
