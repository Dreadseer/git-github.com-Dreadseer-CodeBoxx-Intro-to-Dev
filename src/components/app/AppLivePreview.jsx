// AppLivePreview.jsx — Phone-frame wrapper for the Interactive App live preview.
// Shows a working interactive version of the student's app.

"use client";

import { useBuilder } from "@/context/BuilderContext";
import MessageCycler from "@/components/app/MessageCycler";
import WidgetCanvas from "@/components/shared/WidgetCanvas";

export default function AppLivePreview({
  onDrop,
  onRemove,
  onEdit,
  selectedWidgetId,
  showHints = false,
}) {
  const { formData } = useBuilder();
  const widgets = formData.widgets || [];

  const canvasProps = { widgets, onDrop, onRemove, onEdit, selectedWidgetId, showHints };

  return (
    <div className="flex justify-center">
      {/* Phone frame outer wrapper */}
      <div className="w-full max-w-[280px] aspect-[9/16] border-4 border-ink-700 rounded-3xl overflow-hidden bg-white flex flex-col justify-center shadow-[0_0_40px_rgba(245,197,24,0.07)]">

        {/* Top slot — above the app content */}
        <div className="px-2 pt-2 empty:p-0">
          <WidgetCanvas slot="top" {...canvasProps} />
        </div>

        {/* After-header slot — between title and message box */}
        <div className="px-2 empty:p-0">
          <WidgetCanvas slot="after_header" {...canvasProps} />
        </div>

        {/* MessageCycler in compact mode for the smaller phone frame */}
        <MessageCycler
          appTitle={formData.appTitle}
          buttonLabel={formData.buttonLabel}
          messages={formData.messages}
          themeColor={formData.themeColor}
          compact={true}
        />

        {/* Bottom slot — below the button */}
        <div className="px-2 pb-2 empty:p-0">
          <WidgetCanvas slot="bottom" {...canvasProps} />
        </div>

      </div>
    </div>
  );
}
