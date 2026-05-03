"use client";

import { useWebPage } from "@/context/WebPageContext";
import PanelSection from "./PanelSection";
import SectionToggle from "./SectionToggle";

export default function AboutPanel() {
  const { formData, updateSection, toggleSection } = useWebPage();
  const { about } = formData.sections;

  return (
    <div className="panel-sections">
      <SectionToggle
        label="Show About section"
        enabled={about.enabled}
        onToggle={() => toggleSection("about")}
      />

      {about.enabled && (
        <>
          <PanelSection title="Section Heading">
            <input
              className="panel-input"
              type="text"
              value={about.heading}
              onChange={(e) => updateSection("about", "heading", e.target.value)}
              placeholder="About Me"
              maxLength={40}
            />
          </PanelSection>

          <PanelSection title="Your Bio" hint={`${about.bio.length}/400`}>
            <textarea
              className="panel-textarea"
              value={about.bio}
              onChange={(e) => updateSection("about", "bio", e.target.value)}
              placeholder="Write a short paragraph about yourself — your interests, goals, or what makes you unique..."
              maxLength={400}
              rows={5}
            />
          </PanelSection>
        </>
      )}

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

        .panel-textarea {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #111827;
          background: #ffffff;
          outline: none;
          resize: vertical;
          line-height: 1.6;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .panel-textarea:focus { border-color: #facc15; }
        .panel-textarea::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
