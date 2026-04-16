// StepHeader.jsx — Displays the back arrow and title at the top of a step screen.
// Accepts either a link (backHref) or a function (onBack) for the back action.

import Link from "next/link";

export default function StepHeader({ title, backHref, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-6">

      {/* Back arrow — renders as a Link or a button depending on which prop is passed */}
      {backHref && (
        <Link href={backHref} className="text-gray-500 text-xl font-bold leading-none">
          ←
        </Link>
      )}
      {onBack && !backHref && (
        <button
          onClick={onBack}
          className="text-gray-500 text-xl font-bold leading-none"
        >
          ←
        </button>
      )}

      {/* Page or step title */}
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>

    </div>
  );
}
