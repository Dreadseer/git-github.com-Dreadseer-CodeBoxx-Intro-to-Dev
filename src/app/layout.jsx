// layout.jsx — Root layout applied to every page in the app.
// Global font, background, and metadata come from globals.css tokens.

import "./globals.css";

// Metadata shown in the browser tab and when the link is shared
export const metadata = {
  title: "CodeBoxx Build Lab — Build Something Real",
  description:
    "Scan. Build. Launch. Turn five minutes at a CodeBoxx event into your first working creation — no account, no install, no experience needed.",
};

export const viewport = {
  themeColor: "#0a0d14",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
