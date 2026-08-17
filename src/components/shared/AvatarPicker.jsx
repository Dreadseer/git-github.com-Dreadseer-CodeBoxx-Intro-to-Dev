// AvatarPicker.jsx — Grid of emoji avatar options for the Creator Page path.
// Students pick an icon that appears on their personal landing page.

import { AVATAR_OPTIONS } from "@/data/avatars";

export default function AvatarPicker({ selectedAvatar, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-3 my-4">
      {AVATAR_OPTIONS.map((avatar) => {
        const isSelected = selectedAvatar === avatar.key;
        return (
          <button
            key={avatar.key}
            aria-pressed={isSelected}
            onClick={() => onChange(avatar.key)}
            className={`flex flex-col items-center justify-center min-h-[72px] rounded-xl border p-2
              transition-transform duration-150 active:scale-95 ${
                isSelected
                  ? "bg-ink-700 border-accent"
                  : "bg-ink-900 border-line"
              }`}
          >
            <span className="text-2xl">{avatar.emoji}</span>
            <span
              className={`text-xs mt-1 ${
                isSelected ? "text-accent font-semibold" : "text-fg-dim"
              }`}
            >
              {avatar.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
