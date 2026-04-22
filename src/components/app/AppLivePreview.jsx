// AppLivePreview.jsx — Phone-frame wrapper for the App Builder live preview.
// Shows a working interactive version of the student's app. Includes widget canvas slots.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import MessageCycler from "@/components/app/MessageCycler";
import WidgetCanvas from "@/components/shared/WidgetCanvas";

export default function AppLivePreview({ onDrop, onRemove, onEdit, selectedWidgetId }) {
  const { formData } = useAppBuilder();
  const widgets = formData.widgets || [];

  return (
    <div className="flex justify-center">
      {/* Phone frame outer wrapper */}
      <div className="w-full max-w-[280px] aspect-[9/16] border-4 border-gray-800 rounded-3xl overflow-hidden bg-white flex flex-col justify-center">

        {/* Top slot — above the app content */}
        <div className="px-2 pt-2">
          <WidgetCanvas
            widgets={widgets}
            slot="top"
            onDrop={onDrop}
            onRemove={onRemove}
            onEdit={onEdit}
            selectedWidgetId={selectedWidgetId}
          />
        </div>

        {/* After-header slot — between title and message box */}
        <div className="px-2">
          <WidgetCanvas
            widgets={widgets}
            slot="after_header"
            onDrop={onDrop}
            onRemove={onRemove}
            onEdit={onEdit}
            selectedWidgetId={selectedWidgetId}
          />
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
        <div className="px-2 pb-2">
          <WidgetCanvas
            widgets={widgets}
            slot="bottom"
            onDrop={onDrop}
            onRemove={onRemove}
            onEdit={onEdit}
            selectedWidgetId={selectedWidgetId}
          />
        </div>

      </div>
    </div>
  );
}
