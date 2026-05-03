"use client";

export default function SectionToggle({ label, enabled, onToggle }) {
  return (
    <label className="st-root">
      <span className="st-label">{label}</span>
      <div className="st-track" data-enabled={enabled}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="st-input"
        />
        <span className="st-thumb" />
      </div>

      <style>{`
        .st-root {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
        }

        .st-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .st-track {
          position: relative;
          width: 44px;
          height: 24px;
          background: #d1d5db;
          border-radius: 12px;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .st-track[data-enabled="true"] { background: #facc15; }

        .st-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          margin: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
        }

        .st-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 50%;
          transition: transform 0.2s;
          pointer-events: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .st-track[data-enabled="true"] .st-thumb {
          transform: translateX(20px);
        }
      `}</style>
    </label>
  );
}
