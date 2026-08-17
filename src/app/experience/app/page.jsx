// page.jsx — Interactive App build flow (Missions 02–04).
// All flow logic lives in BuilderScreen; this page supplies the path-specific parts.

"use client";

import BuilderScreen from "@/components/shared/BuilderScreen";
import AppFormStep1 from "@/components/app/AppFormStep1";
import AppFormStep2 from "@/components/app/AppFormStep2";
import AppFormStep3 from "@/components/app/AppFormStep3";
import AppLivePreview from "@/components/app/AppLivePreview";
import { generateAppCode } from "@/utils/generateAppCode";

export default function AppBuilderPage() {
  return (
    <BuilderScreen
      stepComponents={[AppFormStep1, AppFormStep2, AppFormStep3]}
      PreviewComponent={AppLivePreview}
      generateCode={generateAppCode}
      getProjectName={(data) => data.appTitle || "Your App"}
    />
  );
}
