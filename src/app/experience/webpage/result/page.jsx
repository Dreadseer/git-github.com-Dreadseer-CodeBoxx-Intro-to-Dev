"use client";

import { redirect } from "next/navigation";
import { useWebPage } from "@/context/WebPageContext";
import { generateWebPageCode } from "@/utils/generateWebPageCode";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
import EmailSubmissionForm from "@/components/shared/EmailSubmissionForm";
import WebPageResultCard from "@/components/webpage/WebPageResultCard";

export default function WebPageResultPage() {
  const { formData } = useWebPage();

  // Guard: if no name, send back to builder
  if (!formData.name) {
    redirect("/experience/webpage");
  }

  const generatedCode = generateWebPageCode(formData);

  return (
    <div className="result-root">

      {/* Header */}
      <header className="result-header">
        <a href="/experience/webpage" className="result-back">← Edit my site</a>
        <h1 className="result-title">Your site is ready! 🎉</h1>
      </header>

      <div className="result-content">
        {/* Full-width result card */}
        <section className="result-card-wrap">
          <WebPageResultCard formData={formData} />
        </section>

        <div className="result-sidebar">
          <SeeTheCodePanel
            code={generatedCode}
            defaultOpen={false}
            experience="webpage"
            lastChanged={formData.lastChanged}
          />
          <CodeBoxxCTA />
          <EmailSubmissionForm
            name={formData.name}
            experience="webpage"
            generatedCode={generatedCode}
          />
        </div>
      </div>

      <style>{`
        .result-root {
          min-height: 100vh;
          background: #f3f4f6;
        }

        .result-header {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .result-back {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .result-back:hover { color: #111827; }

        .result-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .result-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.5rem;
          align-items: start;
        }

        .result-card-wrap {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .result-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: sticky;
          top: 1.5rem;
        }

        @media (max-width: 768px) {
          .result-content {
            grid-template-columns: 1fr;
          }

          .result-sidebar {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
