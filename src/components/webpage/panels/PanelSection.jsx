"use client";

// PanelSection — reusable labeled section wrapper
export default function PanelSection({ title, hint, children }) {
  return (
    <div className="ps-root">
      <div className="ps-header">
        <label className="ps-title">{title}</label>
        {hint && <span className="ps-hint">{hint}</span>}
      </div>
      {children}

      <style>{`
        .ps-root { display: flex; flex-direction: column; gap: 6px; }
        .ps-header { display: flex; align-items: baseline; justify-content: space-between; }
        .ps-title { font-size: 0.8rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; }
        .ps-hint  { font-size: 0.72rem; color: #9ca3af; }
      `}</style>
    </div>
  );
}
