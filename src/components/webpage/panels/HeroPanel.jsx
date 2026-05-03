"use client";

import { useWebPage } from "@/context/WebPageContext";
import { AVATAR_OPTIONS } from "@/data/avatars";
import PanelSection from "./PanelSection";

export default function HeroPanel() {
  const { formData, updateField } = useWebPage();

  return (
    <div className="panel-sections">

      <PanelSection title="Your Name *" hint="Required to build your site">
        <input
          className="panel-input"
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="e.g. Alex Dupont"
          maxLength={60}
        />
      </PanelSection>

      <PanelSection title="Tagline" hint="Your role, dream job, or a short phrase">
        <input
          className="panel-input"
          type="text"
          value={formData.tagline}
          onChange={(e) => updateField("tagline", e.target.value)}
          placeholder="e.g. Future Software Engineer"
          maxLength={80}
        />
      </PanelSection>

      <PanelSection title="Your Icon">
        <div className="avatar-grid">
          {AVATAR_OPTIONS.map((a) => (
            <button
              key={a.key}
              className={`avatar-btn ${formData.avatar === a.key ? "selected" : ""}`}
              onClick={() => updateField("avatar", a.key)}
              aria-label={a.label}
              title={a.label}
            >
              {a.emoji}
            </button>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Hero Background">
        <div className="radio-group">
          {[
            { value: "gradient", label: "Gradient", desc: "Smooth color fade" },
            { value: "solid",    label: "Solid",    desc: "Flat color" },
          ].map((opt) => (
            <label key={opt.value} className="radio-option">
              <input
                type="radio"
                name="heroBg"
                value={opt.value}
                checked={formData.heroBackground === opt.value}
                onChange={() => updateField("heroBackground", opt.value)}
              />
              <div className="radio-content">
                <span className="radio-label">{opt.label}</span>
                <span className="radio-desc">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Call-to-Action Button">
        <label className="toggle-row">
          <span className="toggle-text">Show button</span>
          <div className="toggle-track">
            <input
              type="checkbox"
              checked={formData.ctaEnabled}
              onChange={(e) => updateField("ctaEnabled", e.target.checked)}
            />
            <span className="toggle-thumb" />
          </div>
        </label>
        {formData.ctaEnabled && (
          <>
            <input
              className="panel-input"
              style={{ marginTop: "0.625rem" }}
              type="text"
              value={formData.ctaLabel}
              onChange={(e) => updateField("ctaLabel", e.target.value)}
              placeholder="e.g. Contact Me"
              maxLength={30}
            />
            <label className="panel-field-label" style={{ marginTop: "0.75rem" }}>
              Button Link
            </label>
            <input
              className="panel-input"
              style={{ marginTop: "0.25rem" }}
              type="url"
              value={formData.ctaUrl}
              onChange={(e) => updateField("ctaUrl", e.target.value)}
              placeholder="https://"
            />
            <p className="panel-field-hint">Leave blank to scroll to Contact section</p>
          </>
        )}
      </PanelSection>

      <style>{`
        .panel-sections { display: flex; flex-direction: column; gap: 1.5rem; }

        .panel-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #111827;
          background: #ffffff;
          outline: none;
          transition: border-color 0.15s;
        }
        .panel-input:focus { border-color: #facc15; }
        .panel-input::placeholder { color: #9ca3af; }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .avatar-btn {
          font-size: 1.75rem;
          padding: 8px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: #f9fafb;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, transform 0.1s;
          line-height: 1;
        }

        .avatar-btn:hover { border-color: #d1d5db; transform: scale(1.05); }

        .avatar-btn.selected {
          border-color: #facc15;
          background: #fffbeb;
          transform: scale(1.08);
        }

        .radio-group { display: flex; flex-direction: column; gap: 8px; }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .radio-option:has(input:checked) { border-color: #facc15; background: #fffbeb; }

        .radio-option input { accent-color: #facc15; }

        .radio-content { display: flex; flex-direction: column; }

        .radio-label { font-size: 0.9rem; font-weight: 600; color: #111827; }

        .radio-desc { font-size: 0.75rem; color: #6b7280; }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .panel-field-label { font-size: 0.8rem; font-weight: 600; color: #374151; display: block; }
        .panel-field-hint { font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem; }
        .toggle-text { font-size: 0.9rem; color: #374151; }

        .toggle-track {
          position: relative;
          width: 40px;
          height: 22px;
          background: #d1d5db;
          border-radius: 11px;
          transition: background 0.2s;
        }

        .toggle-track:has(input:checked) { background: #facc15; }

        .toggle-track input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          margin: 0;
          z-index: 1;
        }

        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          pointer-events: none;
        }

        .toggle-track:has(input:checked) .toggle-thumb {
          transform: translateX(18px);
        }
      `}</style>
    </div>
  );
}
