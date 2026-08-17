// ColorSwatchPicker.jsx — Row of tappable color swatches for theme selection.
// Includes the hidden Midnight swatch once the easter egg has been unlocked.

"use client";

import { useEffect, useState } from "react";
import {
  THEME_COLORS,
  SECRET_THEME,
  SECRET_THEME_KEY,
  SECRET_UNLOCK_FLAG,
} from "@/data/themes";

export default function ColorSwatchPicker({ selectedColor, onChange }) {
  const [secretUnlocked, setSecretUnlocked] = useState(false);

  // Check the unlock flag on the client only (sessionStorage isn't available on the server)
  useEffect(() => {
    try {
      setSecretUnlocked(sessionStorage.getItem(SECRET_UNLOCK_FLAG) === "1");
    } catch {
      // Storage unavailable — the secret stays secret
    }
  }, []);

  const entries = Object.entries(THEME_COLORS);
  if (secretUnlocked) {
    entries.push([SECRET_THEME_KEY, SECRET_THEME]);
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 my-4">
      {entries.map(([key, theme]) => {
        const isSelected = selectedColor === key;
        const isSecret = key === SECRET_THEME_KEY;
        return (
          <button
            key={key}
            aria-label={theme.label}
            aria-pressed={isSelected}
            onClick={() => onChange(key)}
            style={{ backgroundColor: theme.hex }}
            className={`relative w-12 h-12 rounded-full transition-transform duration-150
              active:scale-90 ${
                isSelected
                  ? "ring-2 ring-offset-2 ring-accent ring-offset-ink-950 scale-110"
                  : "ring-1 ring-line-strong"
              }`}
          >
            {isSecret && (
              <span className="absolute inset-0 flex items-center justify-center text-accent text-sm">
                ★
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
