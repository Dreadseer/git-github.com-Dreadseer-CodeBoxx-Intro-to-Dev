// MessageCycler.jsx — Interactive button and message cycling widget for Experience 2.
// Each tap of the button advances to the next message. Reusable in both preview and result.

"use client";

import { useState } from "react";
import { THEME_COLORS } from "@/data/themes";

export default function MessageCycler({
  appTitle,
  buttonLabel,
  messages,
  themeColor,
  compact = false,
}) {
  // Tracks which message (0, 1, or 2) is currently displayed
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get the full theme object for the selected color key
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["blue"];

  // Advance to the next message, wrapping back to 0 after the last one
  function handleTap() {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  }

  // Use fallback text if any field is empty
  const displayTitle = appTitle || "Your App";
  const displayButton = buttonLabel || "Tap Me";
  const displayMessage =
    messages[currentIndex]?.trim() !== ""
      ? messages[currentIndex]
      : "Your message will appear here";

  return (
    <div className={`flex flex-col items-center gap-3 w-full ${compact ? "px-2 py-2" : "px-4 py-6"}`}>

      {/* App title */}
      <p
        className={`font-bold text-center ${compact ? "text-sm" : "text-xl"}`}
        style={{ color: theme.hex }}
      >
        {displayTitle}
      </p>

      {/* Message display box */}
      <div className={`w-full bg-gray-100 rounded-xl text-center text-gray-700 ${compact ? "text-xs p-3" : "text-base p-5"}`}>
        {displayMessage}
      </div>

      {/* Cycling button */}
      <button
        onClick={handleTap}
        className={`w-full font-bold rounded-xl text-white ${compact ? "text-xs py-2" : "text-lg py-4"}`}
        style={{ backgroundColor: theme.hex }}
      >
        {displayButton}
      </button>

    </div>
  );
}
