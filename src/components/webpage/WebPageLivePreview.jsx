"use client";

import { THEME_COLORS, FONT_PAIRINGS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

/**
 * Full-page live preview of the generated website.
 * Mirrors exactly what the final output will look like.
 */
export default function WebPageLivePreview({ formData }) {
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
  const avatarEmoji = avatarObj?.emoji ?? "🚀";

  const { about, skills, contact } = sections;

  const heroBg =
    heroBackground === "gradient"
      ? `linear-gradient(135deg, ${theme.hex} 0%, ${adjustColor(theme.hex, -30)} 100%)`
      : theme.hex;

  // Nav links for active sections
  const navSections = [
    about.enabled   && { href: "#about",   label: about.heading },
    skills.enabled  && { href: "#skills",  label: skills.heading },
    contact.enabled && { href: "#contact", label: contact.heading },
  ].filter(Boolean);

  // Social links
  const socialLinks = [
    contact.github    && { href: contact.github,    label: "GitHub" },
    contact.instagram && { href: contact.instagram, label: "Instagram" },
    contact.linkedin  && { href: contact.linkedin,  label: "LinkedIn" },
  ].filter(Boolean);

  return (
    <div className="preview-root">
      {/* Inject Google Font for live preview */}
      <link rel="stylesheet" href={fonts.cssImport} />

      {/* Nav */}
      <nav className="prev-nav" style={{ fontFamily: fonts.body }}>
        <span className="prev-nav-name" style={{ color: theme.hex, fontFamily: fonts.display }}>
          {name || "Your Name"}
        </span>
        <div className="prev-nav-links">
          {navSections.map((s) => (
            <span key={s.href} className="prev-nav-link">
              {s.label}
            </span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section
        className="prev-hero"
        style={{ background: heroBg, fontFamily: fonts.body }}
      >
        <span className="prev-avatar">{avatarEmoji}</span>
        <h1 className="prev-hero-name" style={{ fontFamily: fonts.display }}>
          {name || <span className="placeholder">Your Name</span>}
        </h1>
        <p className="prev-hero-tagline">
          {tagline || <span className="placeholder">Your tagline goes here</span>}
        </p>
        {ctaEnabled && (
          <div className="prev-cta" style={{ color: theme.hex }}>
            {ctaLabel || "Contact Me"}
          </div>
        )}
      </section>

      {/* About */}
      {about.enabled && (
        <div className="prev-section-alt">
          <section className="prev-section" style={{ fontFamily: fonts.body }}>
            <h2 className="prev-section-heading" style={{ color: theme.hex, fontFamily: fonts.display }}>
              {about.heading}
            </h2>
            <div className="prev-divider" style={{ background: theme.hex }} />
            <p className="prev-bio">
              {about.bio || <span className="placeholder">Your bio will appear here...</span>}
            </p>
          </section>
        </div>
      )}

      {/* Skills */}
      {skills.enabled && (
        <section className="prev-section" style={{ fontFamily: fonts.body }}>
          <h2 className="prev-section-heading" style={{ color: theme.hex, fontFamily: fonts.display }}>
            {skills.heading}
          </h2>
          <div className="prev-divider" style={{ background: theme.hex }} />
          <div className="prev-tags">
            {skills.tags.length > 0
              ? skills.tags.map((tag) => (
                  <span
                    key={tag}
                    className="prev-chip"
                    style={{
                      color: theme.hex,
                      borderColor: theme.hex + "40",
                      background: theme.hex + "15",
                    }}
                  >
                    {tag}
                  </span>
                ))
              : <span className="placeholder">Add skills in the Skills panel →</span>}
          </div>
        </section>
      )}

      {/* Contact */}
      {contact.enabled && (
        <div className="prev-section-alt">
          <section className="prev-section" style={{ fontFamily: fonts.body }}>
            <h2 className="prev-section-heading" style={{ color: theme.hex, fontFamily: fonts.display }}>
              {contact.heading}
            </h2>
            <div className="prev-divider" style={{ background: theme.hex }} />
            {contact.email && (
              <p className="prev-email" style={{ color: theme.hex }}>
                ✉️ {contact.email}
              </p>
            )}
            {!contact.email && (
              <p className="placeholder">Add your email in the Contact panel →</p>
            )}
            {socialLinks.length > 0 && (
              <div className="prev-social">
                {socialLinks.map((s) => (
                  <span
                    key={s.label}
                    className="prev-social-btn"
                    style={{ background: theme.hex }}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="prev-footer" style={{ fontFamily: fonts.body }}>
        Built with <strong>CodeBoxx Academy</strong> ✨
      </footer>

      <style>{`
        .preview-root {
          flex: 1;
          overflow-y: auto;
          background: #f9fafb;
          font-size: 14px; /* Scale everything down slightly for preview */
        }

        /* Nav */
        .prev-nav {
          position: sticky;
          top: 0;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          z-index: 10;
        }
        .prev-nav-name { font-weight: 700; font-size: 1rem; }
        .prev-nav-links { display: flex; gap: 0.25rem; }
        .prev-nav-link {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          padding: 0.2rem 0.5rem;
          border-radius: 5px;
          cursor: default;
        }

        /* Hero */
        .prev-hero {
          color: #ffffff;
          text-align: center;
          padding: 3.5rem 1.5rem 3rem;
        }
        .prev-avatar {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 0.75rem;
          filter: drop-shadow(0 3px 8px rgba(0,0,0,0.2));
        }
        .prev-hero-name {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .prev-hero-tagline {
          font-size: 1rem;
          opacity: 0.9;
          max-width: 380px;
          margin: 0 auto 1.5rem;
        }
        .prev-cta {
          display: inline-block;
          background: #ffffff;
          font-weight: 700;
          font-size: 0.875rem;
          padding: 0.625rem 1.5rem;
          border-radius: 9999px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }

        /* Sections */
        .prev-section-alt { background: #ffffff; }

        .prev-section {
          padding: 2.5rem 1.5rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .prev-section-heading {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.375rem;
        }

        .prev-divider {
          width: 36px;
          height: 3px;
          border-radius: 2px;
          margin-bottom: 1.25rem;
        }

        .prev-bio {
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.8;
          max-width: 560px;
        }

        /* Skills */
        .prev-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .prev-chip {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 9999px;
          border: 1px solid;
        }

        /* Contact */
        .prev-email {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .prev-social {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .prev-social-btn {
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 7px;
        }

        /* Footer */
        .prev-footer {
          background: #1f2937;
          color: #9ca3af;
          text-align: center;
          padding: 1.25rem;
          font-size: 0.8rem;
        }

        .prev-footer strong { color: #e5e7eb; }

        /* Placeholder text */
        .placeholder {
          color: #d1d5db;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
