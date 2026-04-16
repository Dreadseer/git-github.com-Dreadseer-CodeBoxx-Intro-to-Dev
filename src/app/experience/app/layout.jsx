// layout.jsx — Wraps the entire /experience/app route segment with AppBuilderProvider.
// This makes App Builder form state available to both the form page and the result page.

"use client";

import { AppBuilderProvider } from "@/context/AppBuilderContext";

export default function AppLayout({ children }) {
  return <AppBuilderProvider>{children}</AppBuilderProvider>;
}
