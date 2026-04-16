// PrimaryButton.jsx — Main action button used to advance through steps.
// Yellow background, full width, large tap target.

export default function PrimaryButton({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-yellow-400 text-gray-900 font-bold text-lg py-4 rounded-2xl mt-4 ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
}
