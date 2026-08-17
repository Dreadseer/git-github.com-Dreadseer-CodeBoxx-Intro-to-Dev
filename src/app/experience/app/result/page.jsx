// result/page.jsx — Interactive App BUILD COMPLETE screen.

"use client";

import ResultScreen from "@/components/shared/ResultScreen";
import AppResultCard from "@/components/app/AppResultCard";
import { useBuilder } from "@/context/BuilderContext";
import { generateAppCode } from "@/utils/generateAppCode";

export default function AppResultPage() {
  const { formData } = useBuilder();

  return (
    <ResultScreen
      generateCode={generateAppCode}
      requiredField="appTitle"
      studentName={formData.appTitle}
    >
      <AppResultCard />
    </ResultScreen>
  );
}
