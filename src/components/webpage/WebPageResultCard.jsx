// WebPageResultCard.jsx — Full-width display of the student's finished personal landing page.
// Renders base content AND all placed widgets at their correct slot positions.

"use client";

import { useWebPage } from "@/context/WebPageContext";
import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export default function WebPageResultCard() {
  const { formData } = useWebPage();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["purple"];
  const avatarEmoji =
    AVATAR_OPTIONS.find((a) => a.key === formData.avatar)?.emoji || "🚀";
  const widgets = formData.widgets || [];

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* TOP slot widgets */}
      <SlotWidgets widgets={widgets} slot="top" />

      {/* Colored header band with avatar */}
      <div
        className="flex items-center justify-center h-20"
        style={{ backgroundColor: theme.hex }}
      >
        <span className="text-4xl">{avatarEmoji}</span>
      </div>

      {/* AFTER_HEADER slot widgets */}
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

      {/* BOTTOM slot widgets */}
      <SlotWidgets widgets={widgets} slot="bottom" />

      {/* Footer tag */}
      <p className="text-xs text-gray-400 text-center py-4">
        Made with CodeBoxx
      </p>

    </div>
  );
}

// Renders all widgets assigned to a specific placement slot
function SlotWidgets({ widgets, slot }) {
  const slotWidgets = widgets.filter((w) => w.position === slot);
  if (slotWidgets.length === 0) return null;
  return (
    <>
      {slotWidgets.map((widget) => (
        <WidgetResultRenderer key={widget.id} widget={widget} />
      ))}
    </>
  );
}

// Renders the visual output of a single widget for the result screen.
// Read-only — no edit or remove controls.
function WidgetResultRenderer({ widget }) {
  const { type, values } = widget;

  if (type === "heading") {
    return (
      <p className="font-bold text-gray-800 text-sm px-6 py-2">
        {values.text || "My Heading"}
      </p>
    );
  }

  if (type === "button") {
    return (
      <div className="px-6 py-2">
        <span className="inline-block bg-gray-800 text-white text-center rounded-lg py-2 px-4 text-xs">
          {values.label || "Click Me"}
        </span>
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className="flex flex-col gap-1 px-6 py-2">
        {["Name", "Email", "Message"].map((field) => (
          <div key={field} className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-400">
            {field}
          </div>
        ))}
      </div>
    );
  }

  if (type === "message_box") {
    return (
      <div className="mx-6 my-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        {values.text || "Add your message here."}
      </div>
    );
  }

  if (type === "social") {
    return (
      <div className="flex gap-2 flex-wrap px-6 py-2">
        {["github", "instagram", "linkedin"].map((platform) =>
          values[platform] ? (
            <span key={platform} className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
              {platform}: {values[platform]}
            </span>
          ) : null
        )}
      </div>
    );
  }

  return null;
}
