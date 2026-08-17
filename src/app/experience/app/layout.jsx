// layout.jsx — Wraps the /experience/app segment with the Interactive App build state.

"use client";

import { BuilderProvider } from "@/context/BuilderContext";
import { EXPERIENCES } from "@/data/experiences";

export default function AppLayout({ children }) {
  return (
    <BuilderProvider experience={EXPERIENCES.app}>{children}</BuilderProvider>
  );
}
