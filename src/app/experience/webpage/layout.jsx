// layout.jsx — Wraps the entire /experience/webpage route segment with WebPageProvider.
// This makes WebPage form state available to both the form page and the result page.

"use client";

import { WebPageProvider } from "@/context/WebPageContext";

export default function WebPageLayout({ children }) {
  return <WebPageProvider>{children}</WebPageProvider>;
}
