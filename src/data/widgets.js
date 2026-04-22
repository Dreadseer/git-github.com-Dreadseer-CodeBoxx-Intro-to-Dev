// widgets.js — Defines all available widget types for the builder experiences.
// Each widget has a key, label, icon, and the default values it starts with when added.

export const WIDGET_TYPES = [
  {
    key: "heading",
    label: "Text / Heading",
    icon: "📝",
    defaults: { text: "My Heading" },
  },
  {
    key: "button",
    label: "Button",
    icon: "🔘",
    defaults: { label: "Click Me", url: "" },
  },
  {
    key: "contact",
    label: "Contact Form",
    icon: "📬",
    defaults: {},
  },
  {
    key: "message_box",
    label: "Message Box",
    icon: "💬",
    defaults: { text: "Add your message here." },
  },
  {
    key: "social",
    label: "Social Links",
    icon: "🔗",
    defaults: { github: "", instagram: "", linkedin: "" },
  },
];
