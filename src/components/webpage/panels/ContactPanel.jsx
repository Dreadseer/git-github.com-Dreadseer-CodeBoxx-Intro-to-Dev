"use client";

import { useWebPage } from "@/context/WebPageContext";
import PanelSection from "./PanelSection";
import SectionToggle from "./SectionToggle";

const SOCIAL_FIELDS = [
  { key: "github",    label: "GitHub URL",    placeholder: "https://github.com/yourname" },
  { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/yourhandle" },
  { key: "linkedin",  label: "LinkedIn URL",  placeholder: "https://linkedin.com/in/yourname" },
];

export default function ContactPanel() {
  const { formData, updateSection, toggleSection } = useWebPage();
  const { contact } = formData.sections;

  return (
    <div className="panel-sections">
      <SectionToggle
        label="Show Contact section"
        enabled={contact.enabled}
        onToggle={() => toggleSection("contact")}
      />

      {contact.enabled && (
        <>
          <PanelSection title="Section Heading">
            <input
              className="panel-input"
              type="text"
              value={contact.heading}
              onChange={(e) => updateSection("contact", "heading", e.target.value)}
              placeholder="Get In Touch"
              maxLength={40}
            />
          </PanelSection>

          <PanelSection title="Your Email" hint="Shown as a clickable mailto link">
            <input
              className="panel-input"
              type="email"
              value={contact.email}
              onChange={(e) => updateSection("contact", "email", e.target.value)}
              placeholder="you@example.com"
            />
          </PanelSection>

          {SOCIAL_FIELDS.map((field) => (
            <PanelSection key={field.key} title={field.label} hint="Optional">
              <input
                className="panel-input"
                type="url"
                value={contact[field.key]}
                onChange={(e) => updateSection("contact", field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            </PanelSection>
          ))}
        </>
      )}

      <style>{`
        .panel-sections { display: flex; flex-direction: column; gap: 1.5rem; }

        .panel-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #111827;
          background: #ffffff;
          outline: none;
          transition: border-color 0.15s;
        }
        .panel-input:focus { border-color: #facc15; }
        .panel-input::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
