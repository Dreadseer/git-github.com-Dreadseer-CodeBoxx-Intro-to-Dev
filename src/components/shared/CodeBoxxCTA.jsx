// CodeBoxxCTA.jsx — Call-to-action block shown at the bottom of every result screen.
// Links students to CodeBoxx Academy. This component is required on all result screens.

export default function CodeBoxxCTA() {
  return (
    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-2 mb-8">

      {/* Headline */}
      <p className="text-xl font-bold text-gray-900 text-center">
        Want to build more?
      </p>

      {/* Subheadline */}
      <p className="text-sm text-gray-500 text-center mt-1">
        CodeBoxx Academy teaches full-stack development in 12 weeks.
        No experience required.
      </p>

      {/* CTA button — external link, opens in new tab */}
      <a
        href={process.env.NEXT_PUBLIC_CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full block bg-yellow-400 text-gray-900 font-bold text-base py-4 rounded-2xl text-center mt-4"
      >
        Learn More at CodeBoxx →
      </a>

      {/* Fine print */}
      <p className="text-xs text-center text-gray-400 mt-3">
        Scan the QR code at our booth to save this link.
      </p>

    </div>
  );
}
