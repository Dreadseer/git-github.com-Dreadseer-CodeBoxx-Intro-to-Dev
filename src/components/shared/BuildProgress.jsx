// BuildProgress.jsx — The build status system: mission track + build percentage bar.
// Shows where the user is, what's done, and how close the project is to launch.

export default function BuildProgress({ missions, currentIndex, percent, decisions }) {
  return (
    <div className="mb-6" aria-label={`Build ${percent}% complete`}>
      {/* Mission track */}
      <div className="flex items-center gap-1.5 mb-2">
        {missions.map((mission, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div key={mission.key} className="flex items-center gap-1.5">
              <span
                className={`sys text-[10px] px-2 py-1 rounded-md border ${
                  done
                    ? "text-ok border-transparent bg-ink-800"
                    : active
                    ? "text-on-accent bg-accent border-accent font-bold"
                    : "text-fg-dim border-line"
                }`}
              >
                {done ? `${mission.label} ✓` : mission.label}
              </span>
              {index < missions.length - 1 && (
                <span className="w-2 h-px bg-line-strong" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {/* Build percentage bar + decisions counter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-ink-800 overflow-hidden">
          <div
            className="build-bar h-full rounded-full bg-accent"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="sys text-[10px] text-fg-mid whitespace-nowrap">
          BUILD {percent}%
        </span>
        {decisions > 0 && (
          <span className="sys text-[10px] text-fg-dim whitespace-nowrap">
            · {decisions} DECISIONS
          </span>
        )}
      </div>
    </div>
  );
}
