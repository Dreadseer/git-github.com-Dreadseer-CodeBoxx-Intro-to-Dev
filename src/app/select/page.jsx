// select/page.jsx — Experience Selector screen.
// Students choose between building a web page or a mini app.

import Link from "next/link";

export default function ExperienceSelectorPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-md mx-auto">

      {/* Back arrow + Page title */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/" className="text-gray-500 text-xl font-bold">
          ←
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          What do you want to build?
        </h1>
      </div>

      {/* Subheadline */}
      <p className="text-sm text-gray-500 mt-1 mb-8 pl-9">
        Pick one. You can always come back and try the other.
      </p>

      {/* Experience Cards */}
      <div className="flex flex-col gap-5">

        {/* Card 1 — Web Page */}
        <Link
          href="/experience/webpage"
          className="flex flex-col justify-between min-h-40 bg-white border border-gray-200 border-l-4 border-l-violet-400 rounded-2xl shadow-sm p-5"
        >
          <div>
            <span className="text-4xl">🌐</span>
            <h2 className="text-lg font-bold text-gray-900 mt-2">
              Build Your First Web Page
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your name, dream job, and a color. We'll build you a personal
              landing page and show you the code behind it.
            </p>
          </div>
          <p className="text-sm font-semibold text-violet-500 text-right mt-4">
            Let's go →
          </p>
        </Link>

        {/* Card 2 — Mini App */}
        <Link
          href="/experience/app"
          className="flex flex-col justify-between min-h-40 bg-white border border-gray-200 border-l-4 border-l-blue-400 rounded-2xl shadow-sm p-5"
        >
          <div>
            <span className="text-4xl">📱</span>
            <h2 className="text-lg font-bold text-gray-900 mt-2">
              Build Your First App
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pick a button, write three messages, and we'll build you a working
              interactive app — then show you how it works.
            </p>
          </div>
          <p className="text-sm font-semibold text-blue-500 text-right mt-4">
            Let's go →
          </p>
        </Link>

      </div>

      {/* Footer Note */}
      <p className="text-xs text-center text-gray-400 mt-6">
        Both experiences take about 5 minutes.
      </p>

    </main>
  );
}
