// PrimaryButton.jsx — Main action button used to advance through missions.
// CodeBoxx yellow, full width, large tap target, press feedback.

export default function PrimaryButton({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-accent text-on-accent font-bold text-lg py-4 rounded-xl mt-4
        transition-transform duration-150 ${
          disabled
            ? "opacity-30 cursor-not-allowed"
            : "active:scale-[0.98]"
        }`}
    >
      {label}
    </button>
  );
}
