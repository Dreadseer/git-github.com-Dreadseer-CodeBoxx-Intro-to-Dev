// generateWebPageCode.js — Builds a complete HTML page string from the student's form data.
// This is the code revealed in the "See the Code" section on the result screen.

import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export function generateWebPageCode({ name, dreamJob, bio, themeColor, avatar, widgets }) {
  // Look up the hex color for the chosen theme
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["purple"];

  // Look up the emoji for the chosen avatar
  const emoji =
    AVATAR_OPTIONS.find((a) => a.key === avatar)?.emoji || "🚀";

  const topWidgets = widgetsToHTML(widgets, "top");
  const afterHeaderWidgets = widgetsToHTML(widgets, "after_header");
  const bottomWidgets = widgetsToHTML(widgets, "bottom");

  // Return a complete HTML page as a template string
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- This tells the browser what kind of document this is -->
  <meta charset="UTF-8" />

  <!-- This makes the page look good on mobile phones -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- This is the title shown in the browser tab -->
  <title>${name}'s Page</title>

  <style>
    /* This resets default browser spacing */
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background: #ffffff;
      text-align: center;
    }

    /* This sets your page's color */
    .header {
      background-color: ${theme.hex};
      padding: 32px 16px;
      font-size: 48px;
    }

    /* This styles your name */
    .name {
      color: ${theme.hex};
      font-size: 28px;
      font-weight: bold;
      margin: 20px 0 4px;
    }

    /* This styles your dream job title */
    .job {
      color: #6b7280;
      font-size: 14px;
      margin: 0 0 16px;
    }

    /* This is the short divider line */
    .divider {
      width: 48px;
      height: 2px;
      background-color: ${theme.hex};
      margin: 0 auto 16px;
      border-radius: 2px;
    }

    /* This styles your bio text */
    .bio {
      color: #374151;
      font-size: 14px;
      max-width: 320px;
      margin: 0 auto;
      line-height: 1.6;
      padding: 0 16px;
    }

    /* This is the small footer at the bottom */
    .footer {
      color: #9ca3af;
      font-size: 11px;
      margin-top: 32px;
      padding-bottom: 24px;
    }
  </style>
</head>
<body>
${topWidgets ? `\n  <!-- Top widgets -->\n${topWidgets}\n` : ""}
  <!-- This is your header bar with your chosen icon -->
  <div class="header">${emoji}</div>
${afterHeaderWidgets ? `\n  <!-- After header widgets -->\n${afterHeaderWidgets}\n` : ""}
  <!-- This displays your name -->
  <p class="name">${name}</p>

  <!-- This displays your dream job -->
  <p class="job">${dreamJob}</p>

  <!-- This is the decorative line between your title and bio -->
  <div class="divider"></div>

  <!-- This displays your bio -->
  <p class="bio">${bio}</p>
${bottomWidgets ? `\n  <!-- Bottom widgets -->\n${bottomWidgets}\n` : ""}
  <!-- This is the footer credit -->
  <p class="footer">Made with CodeBoxx</p>

</body>
</html>`;
}

function widgetsToHTML(widgets, slot) {
  const slotWidgets = (widgets || []).filter((w) => w.position === slot);
  if (slotWidgets.length === 0) return "";
  return slotWidgets.map((widget) => widgetToHTML(widget)).join("\n");
}

function widgetToHTML(widget) {
  const { type, values } = widget;

  if (type === "heading") {
    return `  <!-- Custom heading widget -->\n  <h2 style="font-weight:bold;text-align:center;padding:8px 16px;">${values.text || "My Heading"}</h2>`;
  }
  if (type === "button") {
    const href = values.url ? ` href="${values.url}"` : "";
    return `  <!-- Custom button widget -->\n  <a${href} style="display:inline-block;background:#1f2937;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;">${values.label || "Click Me"}</a>`;
  }
  if (type === "contact") {
    return `  <!-- Contact form widget -->\n  <form style="display:flex;flex-direction:column;gap:8px;padding:0 16px;">\n    <input placeholder="Name" style="border:1px solid #d1d5db;border-radius:8px;padding:8px;" />\n    <input placeholder="Email" style="border:1px solid #d1d5db;border-radius:8px;padding:8px;" />\n    <textarea placeholder="Message" style="border:1px solid #d1d5db;border-radius:8px;padding:8px;"></textarea>\n  </form>`;
  }
  if (type === "message_box") {
    return `  <!-- Message box widget -->\n  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;margin:0 16px;font-size:14px;color:#1e40af;">${values.text || "Add your message here."}</div>`;
  }
  if (type === "social") {
    const links = ["github", "instagram", "linkedin"]
      .filter((p) => values[p])
      .map((p) => `<a href="${values[p]}" style="font-size:12px;background:#f3f4f6;border-radius:999px;padding:4px 10px;text-decoration:none;color:#374151;">${p}</a>`)
      .join("\n    ");
    return `  <!-- Social links widget -->\n  <div style="display:flex;gap:8px;flex-wrap:wrap;padding:0 16px;">\n    ${links}\n  </div>`;
  }
  return "";
}
