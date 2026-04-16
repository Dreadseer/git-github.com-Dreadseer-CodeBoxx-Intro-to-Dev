// ColorSwatchPicker.jsx — Row of tappable color swatches for theme selection.
// Used in both experiences to let students pick their color.

import { THEME_COLORS } from "@/data/themes";

export default function ColorSwatchPicker({ selectedColor, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 my-4">
      {Object.entries(THEME_COLORS).map(([key, theme]) => (
        <button
          key={key}
          aria-label={theme.label}
          onClick={() => onChange(key)}
          style={{ backgroundColor: theme.hex }}
          className={`w-12 h-12 rounded-full ${
            selectedColor === key
              ? "ring-2 ring-offset-2 ring-gray-900"
              : ""
          }`}
        />
      ))}
    </div>
  );
}
