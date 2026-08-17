// PageShell.jsx — Wrapper applied to every experience page.
// Dark lab surface with a faint grid, safe-area padding, single-column mobile layout.

export default function PageShell({ children }) {
  return (
    <main className="min-h-dvh lab-grid flex flex-col px-5 pt-6 pb-10 max-w-md mx-auto">
      {children}
    </main>
  );
}
