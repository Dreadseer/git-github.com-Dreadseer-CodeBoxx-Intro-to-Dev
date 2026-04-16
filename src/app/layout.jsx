// layout.jsx — Root layout applied to every page in the app.
// Sets the page title, metadata, and global font/background.

import "./globals.css";

// Metadata shown in the browser tab and when the link is shared
export const metadata = {
  title: "CodeBoxx — Build Something Today",
  description:
    "Scan. Tap. Build. Create your first web page or app in 5 minutes at a CodeBoxx event.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
