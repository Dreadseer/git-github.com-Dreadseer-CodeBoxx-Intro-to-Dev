// CodeBoxxCTA.jsx — Recruitment connection shown after the build completes.
// Connects what the student just did to what developers actually do, then
// points at CodeBoxx. Required on every result screen.

export default function CodeBoxxCTA({ decisions = 0 }) {
  return (
    <div className="w-full bg-ink-900 border border-accent/30 rounded-2xl p-6 mt-2 mb-8">

      {/* System eyebrow */}
      <p className="sys text-[10px] text-accent mb-2">TRANSMISSION // NEXT LEVEL</p>

      {/* Headline */}
      <p className="text-xl font-bold text-fg">
        You just did what developers do.
      </p>

      {/* The connection */}
      <p className="text-sm text-fg-mid mt-2 leading-relaxed">
        {decisions > 0
          ? `You made ${decisions} product decisions in about five minutes — and a working product formed around them. `
          : "You made a series of product decisions — and a working product formed around them. "}
        That loop — decide, build, see the result — is software development.
        CodeBoxx Academy teaches you the full version in 12 weeks. No experience
        required.
      </p>

      {/* CTA button — external link, opens in new tab */}
      <a
        href={process.env.NEXT_PUBLIC_CTA_URL || "https://codeboxx.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full block bg-accent text-on-accent font-bold text-base py-4 rounded-xl
          text-center mt-5 transition-transform duration-150 active:scale-[0.98]"
      >
        EXPLORE CODEBOXX →
      </a>

      {/* Fine print */}
      <p className="text-xs text-center text-fg-dim mt-3">
        Ask anyone at the booth — most of them started exactly where you are.
      </p>

    </div>
  );
}
