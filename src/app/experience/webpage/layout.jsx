// layout.jsx — Wraps the /experience/webpage segment with the Creator Page build state.

"use client";

import { BuilderProvider } from "@/context/BuilderContext";
import { EXPERIENCES } from "@/data/experiences";

export default function WebPageLayout({ children }) {
  return (
    <BuilderProvider experience={EXPERIENCES.webpage}>{children}</BuilderProvider>
  );
}
