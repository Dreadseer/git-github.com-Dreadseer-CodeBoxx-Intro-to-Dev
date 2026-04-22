// WebPageLivePreview.jsx — Live preview of the student's personal landing page.
// Updates in real time as the student fills out the form. Includes widget canvas slots.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";
import WidgetCanvas from "@/components/shared/WidgetCanvas";

export default function WebPageLivePreview({ onDrop, onRemove, onEdit, selectedWidgetId }) {
  const { formData } = useWebPage();
  const widgets = formData.widgets || [];

  // Get the full theme object (hex, text color) for the selected theme key
  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["purple"];

  // Get the emoji for the selected avatar key
  const avatarEmoji =
    AVATAR_OPTIONS.find((a) => a.key === formData.avatar)?.emoji || "🚀";

  return (
    <div className="flex justify-center">
      {/* Phone frame outer wrapper */}
      <div className="w-full max-w-[280px] aspect-[9/16] border-4 border-gray-800 rounded-3xl overflow-hidden bg-white flex flex-col">

        {/* Top slot — above all content */}
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

        {/* Colored header bar with avatar emoji */}
        <div
          className="flex items-center justify-center h-16 flex-shrink-0"
          style={{ backgroundColor: theme.hex }}
        >
          <span className="text-3xl">{avatarEmoji}</span>
        </div>

        {/* After-header slot — below the colored bar, above the name */}
        <div className="px-2 pt-2">
          <WidgetCanvas
            widgets={widgets}
            slot="after_header"
            onDrop={onDrop}
            onRemove={onRemove}
            onEdit={onEdit}
            selectedWidgetId={selectedWidgetId}
          />
        </div>

        {/* Page content */}
        <div className="flex flex-col items-center px-4 py-2 flex-1 overflow-hidden">

          {/* Student name */}
          <p
            className="text-lg font-bold text-center leading-tight"
            style={{ color: theme.hex }}
          >
            {formData.name || "Your Name"}
          </p>

          {/* Dream job */}
          <p className="text-xs text-gray-500 text-center mt-1">
            {formData.dreamJob || "Dream Job"}
          </p>

          {/* Divider */}
          <div
            className="w-12 h-0.5 my-3 rounded-full"
            style={{ backgroundColor: theme.hex }}
          />

          {/* Bio */}
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            {formData.bio || "Your bio will appear here."}
          </p>

          {/* Bottom slot — below all existing content */}
          <div className="w-full mt-2">
            <WidgetCanvas
              widgets={widgets}
              slot="bottom"
              onDrop={onDrop}
              onRemove={onRemove}
              onEdit={onEdit}
              selectedWidgetId={selectedWidgetId}
            />
          </div>

          {/* Footer tag */}
          <p className="text-[10px] text-gray-400 mt-auto pt-2">
            Made with CodeBoxx
          </p>

        </div>
      </div>
    </div>
  );
}
