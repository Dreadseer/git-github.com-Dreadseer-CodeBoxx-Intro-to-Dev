// WebPageResultCard.jsx — Full-width display of the student's finished personal landing page.
// The hero moment on the result screen.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export default function WebPageResultCard() {
  const { formData } = useWebPage();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["purple"];
  const avatarEmoji =
    AVATAR_OPTIONS.find((a) => a.key === formData.avatar)?.emoji || "🚀";

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* Colored header band with avatar */}
      <div
        className="flex items-center justify-center h-20"
        style={{ backgroundColor: theme.hex }}
      >
        <span className="text-4xl">{avatarEmoji}</span>
      </div>

      {/* Card body */}
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

        {/* Footer tag */}
        <p className="text-xs text-gray-400 mt-5">Made with CodeBoxx</p>

      </div>
    </div>
  );
}
