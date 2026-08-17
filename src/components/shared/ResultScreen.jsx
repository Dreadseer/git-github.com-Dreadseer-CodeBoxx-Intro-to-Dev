// ResultScreen.jsx — Shared BUILD COMPLETE screen for both paths.
// The finished creation, honest build stats, the source, the recruitment
// connection, and next actions. Guards against arriving with no build.

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBuilder } from "@/context/BuilderContext";
import { EXPERIENCES } from "@/data/experiences";
import PageShell from "@/components/shared/PageShell";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
import EmailSubmissionForm from "@/components/shared/EmailSubmissionForm";
import GhostButton from "@/components/shared/GhostButton";
import { getHighlightKey } from "@/utils/getHighlightKey";

export default function ResultScreen({ children, generateCode, requiredField, studentName }) {
  const router = useRouter();
  const { experience, formData, decisions, hydrated, resetBuild } = useBuilder();

  const hasBuild = formData[requiredField]?.trim?.() !== "" && formData[requiredField];

  // Guard: no build in memory or storage — send the student back to the selector.
  // Waits for sessionStorage hydration so a refresh on this page doesn't bounce.
  useEffect(() => {
    if (hydrated && !hasBuild) {
      router.replace("/select");
    }
  }, [hydrated, hasBuild, router]);

  if (!hydrated || !hasBuild) return null;

  const generatedCode = generateCode(formData);
  const highlightKey = getHighlightKey(formData.lastChanged, experience.key);
  const lineCount = generatedCode.split("\n").length;
  const moduleCount = formData.widgets?.length || 0;

  const otherExperience = Object.values(EXPERIENCES).find(
    (exp) => exp.key !== experience.key
  );

  function handleRebuild() {
    resetBuild();
    router.push(experience.route);
  }

  return (
    <PageShell>
      {/* Completion header */}
      <div className="text-center mt-2 mb-1 animate-rise">
        <p className="sys text-[11px] text-ok mb-2">● BUILD COMPLETE</p>
        <h1 className="text-2xl font-bold text-fg">That&apos;s yours.</h1>
        <p className="text-sm text-fg-mid mt-1">
          Built by you, from {decisions} decisions. Go ahead — it works.
        </p>
      </div>

      {/* Build stats */}
      <div className="flex justify-center gap-6 mt-4 mb-2 animate-rise-late">
        <Stat value={decisions} label="DECISIONS" />
        <Stat value={moduleCount} label="MODULES" />
        <Stat value={lineCount} label="LINES OF CODE" />
      </div>

      {/* The finished creation */}
      {children}

      {/* The source behind it */}
      <SeeTheCodePanel code={generatedCode} highlightKey={highlightKey} />

      {/* The recruitment connection */}
      <CodeBoxxCTA decisions={decisions} />

      {/* Save the build */}
      <EmailSubmissionForm
        generatedCode={generatedCode}
        experience={experience.key}
        studentName={studentName}
      />

      {/* Next actions */}
      <div className="flex flex-col">
        <Link
          href={otherExperience.route}
          className="w-full bg-transparent border border-line-strong text-fg-mid font-semibold
            text-base py-4 rounded-xl text-center active:bg-ink-800 transition-colors"
        >
          Try the other path — {otherExperience.title}
        </Link>
        <GhostButton label="Rebuild this one" onClick={handleRebuild} />
      </div>
    </PageShell>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-accent font-mono">{value}</p>
      <p className="sys text-[9px] text-fg-dim mt-0.5">{label}</p>
    </div>
  );
}
