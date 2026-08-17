// result/page.jsx — Creator Page BUILD COMPLETE screen.

"use client";

import ResultScreen from "@/components/shared/ResultScreen";
import WebPageResultCard from "@/components/webpage/WebPageResultCard";
import { useBuilder } from "@/context/BuilderContext";
import { generateWebPageCode } from "@/utils/generateWebPageCode";

export default function WebPageResultPage() {
  const { formData } = useBuilder();

  return (
    <ResultScreen
      generateCode={generateWebPageCode}
      requiredField="name"
      studentName={formData.name}
    >
      <WebPageResultCard />
    </ResultScreen>
  );
}
