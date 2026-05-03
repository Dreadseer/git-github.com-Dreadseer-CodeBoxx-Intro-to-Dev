import { THEME_COLORS, FONT_PAIRINGS } from "../data/themes.js";
import { AVATAR_OPTIONS } from "../data/avatars.js";

/**
 * Generates a complete standalone HTML page from v2 formData.
 *
 * @param {Object} formData - The full WebPageContext state
 * @returns {string} Complete <!DOCTYPE html> string
 */
export function generateWebPageCode(formData) {
  const {
    name,
    tagline,
    avatar,
    themeColor,
    fontPairing,
    heroBackground,
    ctaLabel,
    ctaEnabled,
    sections,
  } = formData;

  const theme = THEME_COLORS[themeColor] || THEME_COLORS.purple;
  const fonts = FONT_PAIRINGS[fontPairing] || FONT_PAIRINGS.modern;
  const avatarObj = AVATAR_OPTIONS.find((a) => a.key === avatar);
  const avatarEmoji = avatarObj ? avatarObj.emoji : "🚀";

  const { about, skills, contact } = sections;

  // Build hero background style
  const heroBg =
    heroBackground === "gradient"
      ? `linear-gradient(135deg, ${theme.hex} 0%, ${adjustColor(theme.hex, -30)} 100%)`
      : theme.hex;

  // Build nav links for active sections
  const navLinks = [
    about.enabled ? `<a href="#about">${about.heading}</a>` : "",
    skills.enabled ? `<a href="#skills">${skills.heading}</a>` : "",
    contact.enabled ? `<a href="#contact">${contact.heading}</a>` : "",
  ]
    .filter(Boolean)
    .join("\n      ");

  // Build skills pills HTML
  const skillPills =
    skills.enabled && skills.tags.length > 0
      ? skills.tags
          .map(
            (tag) =>
              `<span class="skill-tag">${escapeHtml(tag)}</span>`
          )
          .join("\n        ")
      : '<span class="skill-tag">Add your skills above!</span>';

  // Build social links HTML
  const socialLinks = [
    contact.github
      ? `<a href="${escapeHtml(contact.github)}" class="social-link">GitHub</a>`
      : "",
    contact.instagram
      ? `<a href="${escapeHtml(contact.instagram)}" class="social-link">Instagram</a>`
      : "",
    contact.linkedin
      ? `<a href="${escapeHtml(contact.linkedin)}" class="social-link">LinkedIn</a>`
      : "",
  ]
    .filter(Boolean)
    .join("\n        ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(name || "My Website")}</title>

  <!-- Google Fonts — controls your site typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="${fonts.cssImport}" />

  <style>
    /* ── Reset & base ─────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --theme:   ${theme.hex};    /* Your main brand color */
      --theme-text: ${theme.text}; /* Text on top of brand color */
      --font-display: ${fonts.display};
      --font-body:    ${fonts.body};
    }

    html { scroll-behavior: smooth; } /* Makes nav links scroll nicely */

    body {
      font-family: var(--font-body);
      color: #1f2937;
      background: #f9fafb;
      line-height: 1.6;
    }

    /* ── Navigation bar ───────────────────────────── */
    nav {
      position: sticky;   /* Stays at the top as you scroll */
      top: 0;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      z-index: 100;
    }

    .nav-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--theme);
    }

    nav a {
      color: #4b5563;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
    }

    nav a:hover {
      background: var(--theme);
      color: var(--theme-text);
    }

    .nav-links { display: flex; gap: 0.5rem; }

    /* ── Hero section ─────────────────────────────── */
    #hero {
      background: ${heroBg}; /* Your chosen hero background */
      color: var(--theme-text);
      text-align: center;
      padding: 5rem 2rem 4rem;
    }

    .hero-avatar {
      font-size: 5rem;  /* Your chosen emoji icon */
      margin-bottom: 1rem;
      display: block;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
    }

    .hero-name {
      font-family: var(--font-display);
      font-size: clamp(2rem, 5vw, 3.5rem); /* Scales with screen size */
      font-weight: 700;
      margin-bottom: 0.75rem;
      text-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .hero-tagline {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      opacity: 0.9;
      max-width: 500px;
      margin: 0 auto 2rem;
    }

    .cta-button {
      display: inline-block;
      background: #ffffff;
      color: var(--theme);
      text-decoration: none;
      font-weight: 700;
      font-size: 1rem;
      padding: 0.875rem 2rem;
      border-radius: 9999px; /* Fully rounded pill button */
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    }

    /* ── Section shared styles ────────────────────── */
    section {
      padding: 4rem 2rem;
      max-width: 800px;    /* Keeps content readable on wide screens */
      margin: 0 auto;
    }

    section:nth-child(even) { background: #ffffff; }

    .section-wrapper-alt { background: #ffffff; }

    .section-heading {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: var(--theme);  /* Matches your theme color */
      margin-bottom: 0.5rem;
    }

    .section-divider {
      width: 48px;
      height: 4px;
      background: var(--theme);
      border-radius: 2px;
      margin-bottom: 1.75rem;
    }

    /* ── About section ────────────────────────────── */
    .about-bio {
      font-size: 1.1rem;
      color: #374151;
      max-width: 640px;
      line-height: 1.8;
    }

    /* ── Skills section ───────────────────────────── */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;  /* Wraps chips onto new lines */
      gap: 0.625rem;
    }

    .skill-tag {
      background: color-mix(in srgb, var(--theme) 12%, white);
      color: var(--theme);
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.375rem 1rem;
      border-radius: 9999px;
      border: 1px solid color-mix(in srgb, var(--theme) 25%, transparent);
    }

    /* ── Contact section ──────────────────────────── */
    .contact-email a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--theme);
      font-size: 1.1rem;
      font-weight: 600;
      text-decoration: none;
      margin-bottom: 1.5rem;
    }

    .contact-email a:hover { text-decoration: underline; }

    .social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .social-link {
      display: inline-block;
      background: var(--theme);
      color: var(--theme-text);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      transition: opacity 0.2s;
    }

    .social-link:hover { opacity: 0.85; }

    /* ── Footer ───────────────────────────────────── */
    footer {
      background: #1f2937;
      color: #9ca3af;
      text-align: center;
      padding: 1.5rem;
      font-size: 0.85rem;
    }

    footer a { color: var(--theme); text-decoration: none; }

    /* ── Mobile responsive ────────────────────────── */
    @media (max-width: 600px) {
      nav { padding: 0 1rem; }
      .nav-links { gap: 0.25rem; }
      nav a { padding: 0.25rem 0.5rem; font-size: 0.8rem; }
      #hero { padding: 3.5rem 1.25rem 3rem; }
      section { padding: 3rem 1.25rem; }
    }
  </style>
</head>
<body>

  <!-- Navigation bar — links scroll to each section -->
  <nav>
    <span class="nav-name">${escapeHtml(name || "My Website")}</span>
    <div class="nav-links">
      ${navLinks}
    </div>
  </nav>

  <!-- Hero section — the first thing visitors see -->
  <section id="hero">
    <span class="hero-avatar">${avatarEmoji}</span>
    <h1 class="hero-name">${escapeHtml(name || "Your Name")}</h1>
    <p class="hero-tagline">${escapeHtml(tagline || "Your tagline goes here")}</p>
    ${ctaEnabled ? `<a href="#contact" class="cta-button">${escapeHtml(ctaLabel || "Contact Me")}</a>` : ""}
  </section>

${
  about.enabled
    ? `  <!-- About section — tell visitors who you are -->
  <div class="section-wrapper-alt">
    <section id="about">
      <h2 class="section-heading">${escapeHtml(about.heading)}</h2>
      <div class="section-divider"></div>
      <p class="about-bio">${escapeHtml(about.bio || "Write a short bio about yourself.")}</p>
    </section>
  </div>`
    : ""
}

${
  skills.enabled
    ? `  <!-- Skills section — show off what you know -->
  <section id="skills">
    <h2 class="section-heading">${escapeHtml(skills.heading)}</h2>
    <div class="section-divider"></div>
    <div class="skills-grid">
      ${skillPills}
    </div>
  </section>`
    : ""
}

${
  contact.enabled
    ? `  <!-- Contact section — how people can reach you -->
  <div class="section-wrapper-alt">
    <section id="contact">
      <h2 class="section-heading">${escapeHtml(contact.heading)}</h2>
      <div class="section-divider"></div>
      ${
        contact.email
          ? `<div class="contact-email">
        <a href="mailto:${escapeHtml(contact.email)}">
          ✉️ ${escapeHtml(contact.email)}
        </a>
      </div>`
          : ""
      }
      ${
        socialLinks
          ? `<div class="social-links">
        ${socialLinks}
      </div>`
          : ""
      }
    </section>
  </div>`
    : ""
}

  <!-- Footer -->
  <footer>
    <p>Built with <a href="https://codeboxx.ca" target="_blank">CodeBoxx Academy</a> ✨</p>
  </footer>

</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Darkens a hex color by a given amount (negative = darken, positive = lighten)
 * Used to create the gradient end-stop for the hero background.
 */
function adjustColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
