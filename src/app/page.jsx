// page.jsx — Landing screen. The first screen students see after scanning the QR code.
// Goal: make a strong impression and get them to tap "Start Building" fast.

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 py-12 max-w-md mx-auto">

      {/* CodeBoxx Logo */}
      <Image
        src="/codeboxx-logo.png"
        alt="CodeBoxx Logo"
        width={120}
        height={120}
        className="mb-8"
      />

      {/* Headline */}
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Build something real.
      </h1>

      {/* Subheadline */}
      <p className="text-base text-center text-gray-500 mt-2 mb-8">
        No experience needed. No download. Just you and your phone.
      </p>

      {/* Experience Preview Cards */}
      <div className="flex gap-3 w-full mb-6">

        {/* Card 1 — Web Page */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
          <span className="text-3xl">🌐</span>
          <p className="font-semibold text-gray-800 text-sm mt-2">Web Page</p>
          <p className="text-xs text-gray-500 mt-1">Build your own personal landing page</p>
        </div>

        {/* Card 2 — Mini App */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
          <span className="text-3xl">📱</span>
          <p className="font-semibold text-gray-800 text-sm mt-2">Mini App</p>
          <p className="text-xs text-gray-500 mt-1">Build a simple interactive app</p>
        </div>

      </div>

      {/* Time Estimate Badge */}
      <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-8">
        ⏱ Takes about 5 minutes
      </span>

      {/* Start Button */}
      <Link
        href="/select"
        className="w-full bg-yellow-400 text-gray-900 font-bold text-lg py-4 rounded-2xl text-center block"
      >
        Start Building →
      </Link>

      {/* Footer Note */}
      <p className="text-xs text-center text-gray-400 mt-6">
        Powered by CodeBoxx Academy
      </p>

    </main>
  );
}
