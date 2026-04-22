// result/page.jsx — Experience 2 result screen.
// Shows the student their working interactive app, the code behind it, and the CodeBoxx CTA.

"use client";

import { redirect } from "next/navigation";
import { useAppBuilder } from "@/context/AppBuilderContext";
import PageShell from "@/components/shared/PageShell";
import StepHeader from "@/components/shared/StepHeader";
import AppResultCard from "@/components/app/AppResultCard";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
import { generateAppCode } from "@/utils/generateAppCode";
import { getHighlightKey } from "@/utils/getHighlightKey";

export default function AppResultPage() {
  const { formData } = useAppBuilder();

  // Guard: if the form was never filled, send the student back to the selector
  if (!formData.appTitle) {
    redirect("/select");
  }

  // Generate the HTML + JS code string from the student's form data
  const generatedCode = generateAppCode(formData);

  // Derive which code section to highlight based on the last changed field
  const highlightKey = getHighlightKey(formData.lastChanged, "app");

  return (
    <PageShell>
      <StepHeader title="Your app is ready! 🎉" />
      <AppResultCard />
      <SeeTheCodePanel code={generatedCode} highlightKey={highlightKey} />
      <CodeBoxxCTA />
    </PageShell>
  );
}
