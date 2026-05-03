"use client";

import WebPageLivePreview from "./WebPageLivePreview";

/**
 * Result screen card — renders the same WebPageLivePreview
 * but in a full-width, non-interactive read-only card.
 */
export default function WebPageResultCard({ formData }) {
  return (
    <div className="result-card">
      <WebPageLivePreview formData={formData} />

      <style>{`
        .result-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 600px;
        }

        /* In result mode the preview takes up the full card,
           no max-height constraint — shows the whole site */
        .result-card .preview-root {
          overflow: visible;
        }
      `}</style>
    </div>
  );
}
