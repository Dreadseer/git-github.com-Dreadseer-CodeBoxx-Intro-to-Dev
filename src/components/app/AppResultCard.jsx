// AppResultCard.jsx — Full-width card displaying the student's working interactive app.
// The MessageCycler inside is live — the student can tap the button to cycle messages.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import { THEME_COLORS } from "@/data/themes";
import MessageCycler from "@/components/app/MessageCycler";

export default function AppResultCard() {
  const { formData } = useAppBuilder();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["blue"];

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* Thin colored accent stripe at the top of the card */}
      <div
        className="w-full h-2"
        style={{ backgroundColor: theme.hex }}
      />

      {/* Live interactive app — full size, not compact */}
      <div className="bg-white">
        <MessageCycler
          appTitle={formData.appTitle}
          buttonLabel={formData.buttonLabel}
          messages={formData.messages}
          themeColor={formData.themeColor}
          compact={false}
        />
      </div>

    </div>
  );
}
