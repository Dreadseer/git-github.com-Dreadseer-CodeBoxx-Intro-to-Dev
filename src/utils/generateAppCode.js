// generateAppCode.js — Builds a complete HTML + JavaScript app string from the student's form data.
// This is the code revealed in the "See the Code" section on the result screen.

import { THEME_COLORS } from "@/data/themes";

export function generateAppCode({ appTitle, buttonLabel, messages, themeColor }) {
  // Look up the hex color for the chosen theme
  const theme = THEME_COLORS[themeColor] || THEME_COLORS["blue"];

  // Turn the messages array into a JavaScript array string for the generated code
  const messagesAsJS = JSON.stringify(messages);

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

  <!-- This is your app title -->
  <p class="app-title">${appTitle}</p>

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

  <!-- This is the footer credit -->
  <p style="color: #9ca3af; font-size: 11px; margin-top: 32px;">Made with CodeBoxx</p>

</body>
</html>`;
}
