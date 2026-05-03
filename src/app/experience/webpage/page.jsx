"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWebPage } from "@/context/WebPageContext";
import { generateWebPageCode } from "@/utils/generateWebPageCode";

// Panel sections
import StylePanel    from "@/components/webpage/panels/StylePanel";
import HeroPanel     from "@/components/webpage/panels/HeroPanel";
import AboutPanel    from "@/components/webpage/panels/AboutPanel";
import SkillsPanel   from "@/components/webpage/panels/SkillsPanel";
import ContactPanel  from "@/components/webpage/panels/ContactPanel";

// Live preview
import WebPageLivePreview from "@/components/webpage/WebPageLivePreview";

const SECTIONS = [
  { key: "style",   label: "Site Style",  icon: "🎨" },
  { key: "hero",    label: "Hero",         icon: "⭐" },
  { key: "about",   label: "About",        icon: "👤" },
  { key: "skills",  label: "Skills",       icon: "⚡" },
  { key: "contact", label: "Contact",      icon: "✉️"  },
];

export default function WebPageBuilderPage() {
  const { formData } = useWebPage();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");
  const [previewVisible, setPreviewVisible] = useState(false); // mobile toggle

  function handleBuild() {
    if (!formData.name.trim()) {
      setActiveSection("hero");
      return;
    }
    router.push("/experience/webpage/result");
  }

  const canBuild = formData.name.trim().length > 0;

  return (
    <div className="builder-root">

      {/* ── Top bar (mobile only) ───────────────────────────────── */}
      <header className="builder-topbar">
        <span className="builder-topbar-title">Website Builder</span>
        <button
          className="preview-toggle-btn"
          onClick={() => setPreviewVisible((v) => !v)}
        >
          {previewVisible ? "← Edit" : "Preview →"}
        </button>
      </header>

      {/* ── Main layout ────────────────────────────────────────── */}
      <div className={`builder-layout ${previewVisible ? "show-preview" : ""}`}>

        {/* Side panel */}
        <aside className="builder-panel">

          {/* Section tabs */}
          <nav className="panel-nav">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                className={`panel-tab ${activeSection === s.key ? "active" : ""}`}
                onClick={() => setActiveSection(s.key)}
              >
                <span className="tab-icon">{s.icon}</span>
                <span className="tab-label">{s.label}</span>
              </button>
            ))}
          </nav>

          {/* Active section content */}
          <div className="panel-content">
            {activeSection === "style"   && <StylePanel />}
            {activeSection === "hero"    && <HeroPanel />}
            {activeSection === "about"   && <AboutPanel />}
            {activeSection === "skills"  && <SkillsPanel />}
            {activeSection === "contact" && <ContactPanel />}
          </div>

          {/* Build CTA */}
          <div className="panel-footer">
            {!canBuild && (
              <p className="build-hint">
                Add your name in the Hero section to continue
              </p>
            )}
            <button
              className={`build-btn ${canBuild ? "ready" : "disabled"}`}
              onClick={handleBuild}
              disabled={!canBuild}
            >
              Build My Site →
            </button>
          </div>
        </aside>

        {/* Live preview */}
        <main className="builder-preview">
          <div className="preview-label">Live Preview</div>
          <WebPageLivePreview formData={formData} />
        </main>

      </div>

      <style>{`
        /* ── Layout ───────────────────────────────── */
        .builder-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #f3f4f6;
        }

        .builder-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* ── Side panel ───────────────────────────── */
        .builder-panel {
          width: 340px;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          overflow: hidden;
          flex-shrink: 0;
        }

        /* ── Panel tabs ───────────────────────────── */
        .panel-nav {
          display: flex;
          overflow-x: auto;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          scrollbar-width: none;
        }
        .panel-nav::-webkit-scrollbar { display: none; }

        .panel-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 10px 14px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 0.7rem;
          color: #6b7280;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }

        .panel-tab:hover { color: #111827; background: #f3f4f6; }

        .panel-tab.active {
          color: #111827;
          border-bottom-color: #facc15;
          background: #fffbeb;
          font-weight: 600;
        }

        .tab-icon { font-size: 1.1rem; }
        .tab-label { font-size: 0.68rem; }

        /* ── Panel content ────────────────────────── */
        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
        }

        /* ── Panel footer ─────────────────────────── */
        .panel-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .build-hint {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .build-btn {
          width: 100%;
          padding: 0.875rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
        }

        .build-btn.ready {
          background: #facc15;
          color: #1f2937;
        }

        .build-btn.ready:hover { transform: translateY(-1px); }

        .build-btn.disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        /* ── Preview area ─────────────────────────── */
        .builder-preview {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .preview-label {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem 1.25rem;
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── Mobile top bar ───────────────────────── */
        .builder-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .builder-topbar-title {
          font-weight: 700;
          font-size: 1rem;
        }

        .preview-toggle-btn {
          background: #facc15;
          border: none;
          border-radius: 8px;
          padding: 0.4rem 0.875rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* ── Mobile breakpoint ────────────────────── */
        @media (max-width: 768px) {
          .builder-topbar { display: flex; }

          .builder-layout {
            position: relative;
          }

          .builder-panel {
            width: 100%;
            position: absolute;
            inset: 0;
            z-index: 10;
            transition: transform 0.3s ease;
          }

          .builder-preview {
            width: 100%;
            position: absolute;
            inset: 0;
            transition: transform 0.3s ease;
          }

          /* Default: show panel, hide preview */
          .builder-panel  { transform: translateX(0); }
          .builder-preview { transform: translateX(100%); }

          /* Toggle: show preview, hide panel */
          .builder-layout.show-preview .builder-panel  { transform: translateX(-100%); }
          .builder-layout.show-preview .builder-preview { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
