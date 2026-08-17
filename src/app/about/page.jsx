// about/page.jsx — The case-study site for the Build Lab.
// Explains and showcases the mobile experience for staff, employers, and
// portfolio reviewers. Desktop gets scroll-driven storytelling and a live
// embedded demo; the app itself stays untouched at "/".

import Link from "next/link";

export const metadata = {
  title: "Scan. Build. Launch. — The CodeBoxx Build Lab",
  description:
    "How a QR code turns five minutes at a recruitment event into someone's first experience building software.",
};

export default function AboutPage() {
  return (
    <main className="min-h-dvh">

      {/* ============ NAV ============ */}
      <nav className="sticky top-0 z-40 bg-ink-950/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/about" className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-accent rounded-sm" aria-hidden="true" />
            <span className="sys text-xs text-fg">
              CODEBOXX <span className="text-fg-dim">// BUILD LAB</span>
            </span>
          </Link>
          <Link
            href="/"
            className="sys text-[11px] font-bold bg-accent text-on-accent px-4 py-2.5 rounded-lg
              transition-transform duration-150 active:scale-95"
          >
            TRY IT →
          </Link>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="lab-grid border-b border-line">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-[3fr_2fr] gap-16 items-center">
          <div>
            <p className="sys text-[11px] text-accent mb-6 animate-rise">
              A RECRUITMENT-EVENT EXPERIENCE<span className="animate-blink">_</span>
            </p>
            <h1 className="font-bold leading-[0.95] animate-rise">
              <span className="block text-5xl sm:text-7xl lg:text-8xl text-fg">SCAN.</span>
              <span className="block text-5xl sm:text-7xl lg:text-8xl text-fg">BUILD.</span>
              <span className="block text-5xl sm:text-7xl lg:text-8xl text-accent">LAUNCH.</span>
            </h1>
            <p className="text-lg text-fg-mid mt-8 max-w-lg leading-relaxed animate-rise-late">
              Turn five minutes at a recruitment event into someone&apos;s first
              experience building something digital — no account, no install,
              no experience required.
            </p>
            <div className="flex flex-wrap gap-4 mt-10 animate-rise-late">
              <Link
                href="/"
                className="bg-accent text-on-accent font-bold text-base px-8 py-4 rounded-xl
                  transition-transform duration-150 active:scale-[0.98]"
              >
                Run the experience →
              </Link>
              <a
                href="#how"
                className="border border-line-strong text-fg-mid font-semibold text-base px-8 py-4 rounded-xl
                  hover:bg-ink-800 transition-colors"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Journey strip — the product in one glance */}
          <div className="hidden lg:flex flex-col gap-3">
            {[
              ["01", "SCAN", "A QR code opens the lab in their browser"],
              ["02", "CHOOSE", "Pick a path: personal page or working app"],
              ["03", "BUILD", "Every choice reshapes a live preview"],
              ["04", "LAUNCH", "A build sequence reveals their creation"],
            ].map(([num, label, text]) => (
              <div
                key={num}
                className="flex items-center gap-4 bg-ink-900 border border-line rounded-xl px-5 py-4"
              >
                <span className="sys text-[10px] text-accent">{num}</span>
                <div>
                  <p className="sys text-xs text-fg font-bold">{label}</p>
                  <p className="text-sm text-fg-dim mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ============ THE PROBLEM ============ */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12">
          <div>
            <p className="sys text-[11px] text-accent mb-4">THE PROBLEM</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-fg leading-tight">
              At a booth, you get five minutes with a stranger holding a phone.
            </h2>
            <p className="text-fg-mid mt-6 leading-relaxed max-w-md">
              Every extra step — an account, a download, a form, an explanation —
              is a chance to lose them. Traditional conversion mechanics were built
              for desks and inboxes, not for someone standing in a noisy gym
              deciding whether technology is for them.
            </p>
          </div>

          {/* Friction comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-ink-900 border border-line rounded-2xl p-6">
              <p className="sys text-[10px] text-fg-dim mb-4">THE OLD WAY</p>
              {["Create an account", "Verify your email", "Set a password", "Install the app", "Sit through onboarding", "…they left 4 steps ago"].map(
                (step, i) => (
                  <p key={step} className={`text-sm py-1.5 ${i === 5 ? "text-danger" : "text-fg-dim line-through"}`}>
                    {step}
                  </p>
                )
              )}
            </div>
            <div className="bg-ink-900 border border-accent/40 rounded-2xl p-6">
              <p className="sys text-[10px] text-accent mb-4">THE BUILD LAB</p>
              {["Scan the QR code", "Tap START BUILD", "Make choices", "Watch it form", "Launch it", "Show a friend"].map((step) => (
                <p key={step} className="text-sm text-fg py-1.5">
                  <span className="text-ok mr-2">✓</span>
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE EXPERIENCE ============ */}
      <section id="how" className="border-b border-line lab-grid">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <p className="sys text-[11px] text-accent mb-4">THE EXPERIENCE</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-fg leading-tight max-w-2xl">
            A five-minute mission where a product forms around your decisions.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              {
                num: "MISSION 01",
                title: "Choose your build",
                text: "A personal Creator Page, or a working Interactive App. The first product decision happens in the first ten seconds.",
              },
              {
                num: "MISSIONS 02–04",
                title: "Shape it live",
                text: "Name, story, color, icon, modules. Every tap immediately reshapes the phone-frame preview — decision, change, result.",
              },
              {
                num: "THE SOURCE",
                title: "See the real code",
                text: "The generated HTML, CSS, and JavaScript scrolls and highlights as they build. Their choices are the code.",
              },
              {
                num: "LAUNCH",
                title: "The payoff",
                text: "A build sequence assembles the project — layout, style, content, interactions — then hands them a working creation and its source.",
              },
            ].map((card) => (
              <div key={card.num} className="bg-ink-900 border border-line rounded-2xl p-6 flex flex-col">
                <p className="sys text-[10px] text-accent mb-3">{card.num}</p>
                <h3 className="text-lg font-bold text-fg">{card.title}</h3>
                <p className="text-sm text-fg-mid mt-2 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LIVE DEMO ============ */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="sys text-[11px] text-accent mb-4">LIVE DEMO</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-fg leading-tight">
              This isn&apos;t a mockup. It&apos;s the product, running.
            </h2>
            <p className="text-fg-mid mt-6 leading-relaxed max-w-md">
              The phone on the right is the real Build Lab — the same experience a
              student gets after scanning the QR code. Go ahead: choose a path,
              make some decisions, launch something.
            </p>
            <p className="sys text-[10px] text-fg-dim mt-8">
              ON MOBILE? JUST TAP TRY IT — YOU ARE THE DEMO.
            </p>
          </div>

          {/* Embedded live app in a phone frame (desktop) */}
          <div className="hidden md:flex justify-center">
            <div className="w-[340px] h-[680px] border-8 border-ink-700 rounded-[2.5rem] overflow-hidden bg-ink-950 shadow-[0_0_80px_rgba(245,197,24,0.1)]">
              <iframe
                src="/"
                title="Live Build Lab demo"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Mobile fallback CTA */}
          <div className="md:hidden">
            <Link
              href="/"
              className="block w-full bg-accent text-on-accent font-bold text-lg py-4 rounded-xl text-center"
            >
              Open the Build Lab →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ENGINEERING ============ */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="sys text-[11px] text-accent mb-4">ENGINEERING</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-fg leading-tight">
              No login wasn&apos;t a missing feature.
              <br />
              It was the architecture.
            </h2>
            <p className="text-fg-mid mt-6 leading-relaxed">
              The entire product is designed backwards from one constraint: a
              stranger&apos;s phone, an unknown browser, and five minutes of
              attention. Everything that couldn&apos;t survive that constraint was
              cut.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              ["EPHEMERAL STATE", "Builds live in React context and sessionStorage. No database, no accounts, nothing to recover — a locked phone doesn't lose the build, and closing the tab is a clean goodbye."],
              ["MOBILE FIRST", "Designed at phone width for one-handed, standing use: 44px+ touch targets, thumb-zone CTAs, no iOS zoom traps, no horizontal scroll."],
              ["MINIMAL DEPENDENCIES", "Next.js, React, Tailwind. System fonts, emoji instead of icon packs, CSS-only motion. The first screen is interactive in seconds on event Wi-Fi."],
              ["INSTANT FEEDBACK", "Every choice re-renders a live preview and regenerates real, commented source code. The feedback loop is the lesson."],
            ].map(([title, text]) => (
              <div key={title} className="border-l-2 border-accent/50 pl-5 py-1">
                <p className="sys text-[10px] text-fg font-bold mb-2">{title}</p>
                <p className="text-sm text-fg-mid leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INSIGHT ============ */}
      <section className="border-b border-line lab-grid">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 text-center">
          <p className="sys text-[11px] text-accent mb-6">WHAT IT TAUGHT ME</p>
          <blockquote className="text-2xl lg:text-4xl font-bold text-fg max-w-3xl mx-auto leading-tight">
            Constraints are design direction.
          </blockquote>
          <p className="text-fg-mid mt-6 max-w-xl mx-auto leading-relaxed">
            Removing authentication, persistence, and setup didn&apos;t shrink the
            product — it clarified it. With nothing standing between a stranger
            and the build, every screen had one job, and the experience got
            sharper each time something was taken away.
          </p>
        </div>
      </section>

      {/* ============ FOOTER CTA ============ */}
      <footer>
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center gap-6">
          <p className="text-lg text-fg-mid text-center">
            Want to see it the way a student does?
          </p>
          <Link
            href="/"
            className="bg-accent text-on-accent font-bold text-lg px-10 py-4 rounded-xl
              transition-transform duration-150 active:scale-[0.98]"
          >
            START BUILD →
          </Link>
          <p className="text-xs text-fg-dim mt-4">
            Built for CodeBoxx Academy ·{" "}
            <a
              href="https://codeboxx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              codeboxx.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
