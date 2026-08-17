// AppResultCard.jsx — Full-width card displaying the student's working interactive app.
// Renders installed modules at their slot positions alongside the MessageCycler.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import { getTheme } from "@/data/themes";
import MessageCycler from "@/components/app/MessageCycler";
import { SlotWidgets } from "@/components/shared/WidgetResultRenderer";

export default function AppResultCard() {
  const { formData } = useBuilder();

  const theme = getTheme(formData.themeColor);
  const widgets = formData.widgets || [];

  return (
    <div className="w-full rounded-2xl overflow-hidden mt-4 mb-6 bg-white shadow-[0_0_50px_rgba(245,197,24,0.1)] animate-pop">

      {/* TOP slot modules */}
      <SlotWidgets widgets={widgets} slot="top" />

      {/* Thin colored accent stripe */}
      <div className="w-full h-2" style={{ backgroundColor: theme.hex }} />

      {/* AFTER_HEADER slot modules */}
      <SlotWidgets widgets={widgets} slot="after_header" />

      {/* Live interactive app — full size */}
      <div className="bg-white">
        <MessageCycler
          appTitle={formData.appTitle}
          buttonLabel={formData.buttonLabel}
          messages={formData.messages}
          themeColor={formData.themeColor}
          compact={false}
        />
      </div>

      {/* BOTTOM slot modules */}
      <SlotWidgets widgets={widgets} slot="bottom" />

    </div>
  );
}
