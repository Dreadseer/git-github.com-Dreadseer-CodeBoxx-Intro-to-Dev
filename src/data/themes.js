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

// Hidden theme — only appears in the picker after the entry-screen easter egg.
// Unlocked by tapping the Build Lab wordmark five times.
export const SECRET_THEME_KEY = "midnight";
export const SECRET_THEME = { label: "Midnight", hex: "#0F172A", text: "#ffffff" };

// sessionStorage flag that records the unlock for this visit
export const SECRET_UNLOCK_FLAG = "cbx_secret_theme";

// Returns the full theme object for a key, including the secret theme
export function getTheme(key) {
  if (key === SECRET_THEME_KEY) return SECRET_THEME;
  return THEME_COLORS[key] || THEME_COLORS.purple;
}

// The theme key that is selected by default before a user makes a choice
export const DEFAULT_THEME = "purple";
