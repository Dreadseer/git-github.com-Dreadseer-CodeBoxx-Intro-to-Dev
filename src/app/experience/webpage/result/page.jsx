// result/page.jsx — Experience 1 result screen.
// Shows the student their finished personal landing page, the code behind it, and the CodeBoxx CTA.

"use client";

import { redirect } from "next/navigation";
import { useWebPage } from "@/context/WebPageContext";
import PageShell from "@/components/shared/PageShell";
import StepHeader from "@/components/shared/StepHeader";
import WebPageResultCard from "@/components/webpage/WebPageResultCard";
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import CodeBoxxCTA from "@/components/shared/CodeBoxxCTA";
import { generateWebPageCode } from "@/utils/generateWebPageCode";

export default function WebPageResultPage() {
  const { formData } = useWebPage();

  // Guard: if the form was never filled, send the student back to the selector
  if (!formData.name) {
    redirect("/select");
  }

  // Generate the HTML code string from the student's form data
  const generatedCode = generateWebPageCode(formData);

  return (
    <PageShell>
      <StepHeader title="Your page is ready! 🎉" />
      <WebPageResultCard />
      <SeeTheCodePanel code={generatedCode} />
      <CodeBoxxCTA />
    </PageShell>
  );
}
