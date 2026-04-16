// GhostButton.jsx — Secondary button for back navigation or optional actions.
// Transparent background with a gray border.

export default function GhostButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-transparent border border-gray-300 text-gray-600 font-semibold text-lg py-4 rounded-2xl mt-2"
    >
      {label}
    </button>
  );
}
