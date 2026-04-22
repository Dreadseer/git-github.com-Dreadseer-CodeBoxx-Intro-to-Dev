// generateAppCode.js — Builds a complete HTML + JavaScript app string from the student's form data.
// This is the code revealed in the "See the Code" section on the result screen.

import { THEME_COLORS } from "@/data/themes";

export function generateAppCode({ appTitle, buttonLabel, messages, themeColor, widgets }) {
  // Look up the hex color for the chosen theme
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["blue"];

  // Turn the messages array into a JavaScript array string for the generated code
  const messagesAsJS = JSON.stringify(messages);

  const topWidgets = widgetsToHTML(widgets, "top");
  const afterHeaderWidgets = widgetsToHTML(widgets, "after_header");
  const bottomWidgets = widgetsToHTML(widgets, "bottom");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- This tells the browser what kind of document this is -->
  <meta charset="UTF-8" />

  <!-- This makes the page look good on mobile phones -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- This is the title shown in the browser tab -->
  <title>${appTitle}</title>

  <style>
    /* This resets default browser spacing */
    body {
      margin: 0;
      padding: 24px 16px;
      font-family: sans-serif;
      background: #ffffff;
      text-align: center;
    }

    /* This sets your app's color */
    .app-title {
      color: ${theme.hex};
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 24px;
    }

    /* This is the box where your message appears */
    .message-box {
      background-color: #f3f4f6;
      border-radius: 12px;
      padding: 20px;
      font-size: 16px;
      color: #374151;
      margin-bottom: 24px;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* This styles your button */
    .tap-button {
      background-color: ${theme.hex};
      color: white;
      font-size: 18px;
      font-weight: bold;
      border: none;
      border-radius: 12px;
      padding: 16px;
      width: 100%;
      cursor: pointer;
    }
  </style>
</head>
<body>
${topWidgets ? `\n  <!-- Top widgets -->\n${topWidgets}\n` : ""}
  <!-- This is your app title -->
  <p class="app-title">${appTitle}</p>
${afterHeaderWidgets ? `\n  <!-- After header widgets -->\n${afterHeaderWidgets}\n` : ""}
  <!-- This box displays the current message -->
  <!-- The id="message" lets JavaScript find and update this element -->
  <div class="message-box" id="message">${messages[0]}</div>

  <!-- This is your button — clicking it runs the showNextMessage function -->
  <button class="tap-button" onclick="showNextMessage()">${buttonLabel}</button>

  <script>
    // These are your three messages stored in an array
    // An array is like a numbered list that JavaScript can read
    var messages = ${messagesAsJS};

    // This variable keeps track of which message we're currently showing
    // We start at 0 because arrays count from 0, not 1
    var currentIndex = 0;

    // This function runs every time the button is clicked
    function showNextMessage() {
      // Move to the next message
      currentIndex = currentIndex + 1;

      // If we've gone past the last message, wrap back to the first one
      // messages.length is 3, so when currentIndex hits 3 we reset to 0
      if (currentIndex >= messages.length) {
        currentIndex = 0;
      }

      // Find the message box element and update its text
      document.getElementById("message").innerText = messages[currentIndex];
    }
  </script>
${bottomWidgets ? `\n  <!-- Bottom widgets -->\n${bottomWidgets}\n` : ""}
  <!-- This is the footer credit -->
  <p style="color: #9ca3af; font-size: 11px; margin-top: 32px;">Made with CodeBoxx</p>

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
