// AppResultCard.jsx — Full-width card displaying the student's working interactive app.
// Renders placed widgets at their correct slot positions alongside the MessageCycler.

"use client";

import { useAppBuilder } from "@/context/AppBuilderContext";
import { THEME_COLORS } from "@/data/themes";
import MessageCycler from "@/components/app/MessageCycler";

export default function AppResultCard() {
  const { formData } = useAppBuilder();

  const theme = THEME_COLORS[formData.themeColor] || THEME_COLORS["blue"];
  const widgets = formData.widgets || [];

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-4 mb-6">

      {/* TOP slot widgets */}
      <SlotWidgets widgets={widgets} slot="top" />

      {/* Thin colored accent stripe */}
      <div
        className="w-full h-2"
        style={{ backgroundColor: theme.hex }}
      />

      {/* AFTER_HEADER slot widgets */}
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

      {/* BOTTOM slot widgets */}
      <SlotWidgets widgets={widgets} slot="bottom" />

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
