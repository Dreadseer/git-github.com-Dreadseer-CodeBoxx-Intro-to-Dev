"use client";

import { useWebPage } from "@/context/WebPageContext";
import { THEME_COLORS, FONT_PAIRINGS } from "@/data/themes";
import PanelSection from "./PanelSection";

export default function StylePanel() {
  const { formData, updateField } = useWebPage();

  return (
    <div className="panel-sections">

      <PanelSection title="Theme Color">
        <div className="swatch-grid">
          {Object.entries(THEME_COLORS).map(([key, color]) => (
            <button
              key={key}
              className={`swatch ${formData.themeColor === key ? "selected" : ""}`}
              style={{ background: color.hex }}
              onClick={() => updateField("themeColor", key)}
              aria-label={color.label}
              title={color.label}
            />
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Font Pairing">
        <div className="font-grid">
          {Object.entries(FONT_PAIRINGS).map(([key, font]) => (
            <button
              key={key}
              className={`font-option ${formData.fontPairing === key ? "selected" : ""}`}
              onClick={() => updateField("fontPairing", key)}
            >
              <span className="font-label">{font.label}</span>
              <span className="font-sample" style={{ fontFamily: font.display }}>
                Aa
              </span>
            </button>
          ))}
        </div>
      </PanelSection>

      <style>{`
        .panel-sections { display: flex; flex-direction: column; gap: 1.5rem; }

        .swatch-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .swatch {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s;
        }

        .swatch:hover { transform: scale(1.1); }

        .swatch.selected {
          border-color: #111827;
          transform: scale(1.1);
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #111827;
        }

        .font-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .font-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: #ffffff;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }

        .font-option:hover { border-color: #d1d5db; background: #f9fafb; }

        .font-option.selected {
          border-color: #facc15;
          background: #fffbeb;
        }

        .font-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .font-sample {
          font-size: 1.5rem;
          color: #111827;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
