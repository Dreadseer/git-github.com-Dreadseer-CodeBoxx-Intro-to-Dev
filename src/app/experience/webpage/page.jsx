// page.jsx — Creator Page build flow (Missions 02–04).
// All flow logic lives in BuilderScreen; this page supplies the path-specific parts.

"use client";

import BuilderScreen from "@/components/shared/BuilderScreen";
import WebPageFormStep1 from "@/components/webpage/WebPageFormStep1";
import WebPageFormStep2 from "@/components/webpage/WebPageFormStep2";
import WebPageFormStep3 from "@/components/webpage/WebPageFormStep3";
import WebPageLivePreview from "@/components/webpage/WebPageLivePreview";
import { generateWebPageCode } from "@/utils/generateWebPageCode";

export default function WebPageBuilderPage() {
  return (
    <BuilderScreen
      stepComponents={[WebPageFormStep1, WebPageFormStep2, WebPageFormStep3]}
      PreviewComponent={WebPageLivePreview}
      generateCode={generateWebPageCode}
      getProjectName={(data) => (data.name ? `${data.name}'s Page` : "Your Page")}
    />
  );
}
