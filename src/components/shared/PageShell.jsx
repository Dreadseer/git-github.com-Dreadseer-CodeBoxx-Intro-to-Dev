// PageShell.jsx — Wrapper applied to every experience page.
// Handles max-width, padding, and vertical layout consistently.

export default function PageShell({ children }) {
  return (
    <main className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-md mx-auto">
      {children}
    </main>
  );
}
