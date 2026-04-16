// themes.js — Defines the color theme options users can choose from.
// These are used in the ColorSwatchPicker and applied via inline styles in previews.

export const THEME_COLORS = {
  purple: { label: "Purple",  hex: "#7C3AED", text: "#ffffff" },
  blue:   { label: "Blue",    hex: "#2563EB", text: "#ffffff" },
  teal:   { label: "Teal",    hex: "#0D9488", text: "#ffffff" },
  orange: { label: "Orange",  hex: "#EA580C", text: "#ffffff" },
  pink:   { label: "Pink",    hex: "#DB2777", text: "#ffffff" },
  slate:  { label: "Slate",   hex: "#475569", text: "#ffffff" },
};

// The theme key that is selected by default before a user makes a choice
export const DEFAULT_THEME = "purple";
