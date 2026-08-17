// MissionHeader.jsx — Mission eyebrow + title at the top of each build screen.
// Accepts either a link (backHref) or a function (onBack) for the back action.

import Link from "next/link";

export default function MissionHeader({ mission, title, backHref, onBack }) {
  const backClasses =
    "flex items-center justify-center w-11 h-11 -ml-2 rounded-xl text-fg-mid " +
    "active:bg-ink-800 shrink-0";

  return (
    <div className="flex items-start gap-2 mb-4">
      {backHref && (
        <Link href={backHref} aria-label="Go back" className={backClasses}>
          ←
        </Link>
      )}
      {onBack && !backHref && (
        <button onClick={onBack} aria-label="Go back" className={backClasses}>
          ←
        </button>
      )}

      <div className="pt-1">
        {mission && (
          <p className="sys text-[11px] text-accent mb-1">{mission}</p>
        )}
        <h1 className="text-xl font-bold text-fg leading-tight">{title}</h1>
      </div>
    </div>
  );
}
