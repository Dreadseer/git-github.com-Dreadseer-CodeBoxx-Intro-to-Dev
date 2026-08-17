// GhostButton.jsx — Secondary button for back navigation or optional actions.
// Transparent surface with a subtle border on the dark lab background.

export default function GhostButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-transparent border border-line-strong text-fg-mid font-semibold
        text-base py-4 rounded-xl mt-2 active:bg-ink-800 transition-colors duration-150"
    >
      {label}
    </button>
  );
}
