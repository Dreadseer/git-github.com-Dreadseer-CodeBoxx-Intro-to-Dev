"use client";

import { useState } from "react";
import { useWebPage } from "@/context/WebPageContext";
import PanelSection from "./PanelSection";
import SectionToggle from "./SectionToggle";

export default function SkillsPanel() {
  const { formData, updateSection, toggleSection, addSkillTag, removeSkillTag } = useWebPage();
  const { skills } = formData.sections;
  const [inputVal, setInputVal] = useState("");

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag();
    }
    // Backspace on empty input removes the last tag
    if (e.key === "Backspace" && inputVal === "" && skills.tags.length > 0) {
      removeSkillTag(skills.tags[skills.tags.length - 1]);
    }
  }

  function commitTag() {
    const val = inputVal.replace(/,$/, "").trim();
    if (val) {
      addSkillTag(val);
      setInputVal("");
    }
  }

  return (
    <div className="panel-sections">
      <SectionToggle
        label="Show Skills section"
        enabled={skills.enabled}
        onToggle={() => toggleSection("skills")}
      />

      {skills.enabled && (
        <>
          <PanelSection title="Section Heading">
            <input
              className="panel-input"
              type="text"
              value={skills.heading}
              onChange={(e) => updateSection("skills", "heading", e.target.value)}
              placeholder="My Skills"
              maxLength={40}
            />
          </PanelSection>

          <PanelSection title="Skills" hint="Press Enter or comma to add">
            {/* Tag chip display + input */}
            <div className="tag-box">
              {skills.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                  <button
                    className="chip-remove"
                    onClick={() => removeSkillTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="tag-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={commitTag}
                placeholder={skills.tags.length === 0 ? "e.g. Python, Design, Soccer..." : ""}
                maxLength={30}
              />
            </div>
            <p className="tag-hint">{skills.tags.length}/20 skills added</p>
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

        .tag-box {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 8px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          background: #ffffff;
          min-height: 48px;
          cursor: text;
          transition: border-color 0.15s;
        }

        .tag-box:focus-within { border-color: #facc15; }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #fef9c3;
          color: #854d0e;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 9999px;
          border: 1px solid #fde047;
        }

        .chip-remove {
          border: none;
          background: transparent;
          color: #a16207;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .chip-remove:hover { color: #713f12; }

        .tag-input {
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #111827;
          background: transparent;
          min-width: 120px;
          flex: 1;
        }

        .tag-input::placeholder { color: #9ca3af; }

        .tag-hint {
          font-size: 0.72rem;
          color: #9ca3af;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
