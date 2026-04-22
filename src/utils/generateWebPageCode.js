// generateWebPageCode.js — Builds a complete HTML page string from the student's form data.
// This is the code revealed in the "See the Code" section on the result screen.

import { THEME_COLORS } from "@/data/themes";
import { AVATAR_OPTIONS } from "@/data/avatars";

export function generateWebPageCode({ name, dreamJob, bio, themeColor, avatar }) {
  // Look up the hex color for the chosen theme
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["purple"];

  // Look up the emoji for the chosen avatar
  const emoji =
    AVATAR_OPTIONS.find((a) => a.key === avatar)?.emoji || "🚀";

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

  <!-- This is your header bar with your chosen icon -->
  <div class="header">${emoji}</div>

  <!-- This displays your name -->
  <p class="name">${name}</p>

  <!-- This displays your dream job -->
  <p class="job">${dreamJob}</p>

  <!-- This is the decorative line between your title and bio -->
  <div class="divider"></div>

  <!-- This displays your bio -->
  <p class="bio">${bio}</p>

  <!-- This is the footer credit -->
  <p class="footer">Made with CodeBoxx</p>

</body>
</html>`;
}
