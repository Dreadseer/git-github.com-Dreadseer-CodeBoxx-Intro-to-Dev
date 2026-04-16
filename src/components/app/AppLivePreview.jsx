// AppLivePreview.jsx — Phone-frame wrapper for the App Builder live preview.
// Shows a working interactive version of the student's app as they fill out the form.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import MessageCycler from "@/components/app/MessageCycler";

export default function AppLivePreview() {
  const { formData } = useAppBuilder();

  return (
    <div className="flex justify-center">
      {/* Phone frame outer wrapper */}
      <div className="w-full max-w-[280px] aspect-[9/16] border-4 border-gray-800 rounded-3xl overflow-hidden bg-white flex flex-col justify-center">

        {/* MessageCycler in compact mode for the smaller phone frame */}
        <MessageCycler
          appTitle={formData.appTitle}
          buttonLabel={formData.buttonLabel}
          messages={formData.messages}
          themeColor={formData.themeColor}
          compact={true}
        />

      </div>
    </div>
  );
}
