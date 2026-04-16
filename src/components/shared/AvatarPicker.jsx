// AvatarPicker.jsx — Grid of emoji avatar options for Experience 1.
// Students pick an icon that appears on their personal landing page.

import { AVATAR_OPTIONS } from "@/data/avatars";

export default function AvatarPicker({ selectedAvatar, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-3 my-4">
      {AVATAR_OPTIONS.map((avatar) => (
        <button
          key={avatar.key}
          onClick={() => onChange(avatar.key)}
          className={`flex flex-col items-center justify-center min-h-[72px] rounded-xl border p-2 ${
            selectedAvatar === avatar.key
              ? "bg-yellow-100 border-yellow-400"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <span className="text-2xl">{avatar.emoji}</span>
          <span className="text-xs text-gray-600 mt-1">{avatar.label}</span>
        </button>
      ))}
    </div>
  );
}
