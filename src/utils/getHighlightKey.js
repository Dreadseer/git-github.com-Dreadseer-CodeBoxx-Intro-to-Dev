// getHighlightKey.js — Maps a changed field name to the matching comment marker in the generated code.
// Used by the result pages to tell CodeBlock which section to highlight.

// Experience 1 field → marker mappings
const WEBPAGE_MARKERS = {
  name:       "This displays your name",
  dreamJob:   "This displays your dream job",
  bio:        "This displays your bio",
  themeColor: "This sets your page's color",
  avatar:     "This is your header bar with your chosen icon",
  widget:     "Made with CodeBoxx",
};

// Experience 2 field → marker mappings
const APP_MARKERS = {
  appTitle:    "This is your app title",
  buttonLabel: "This is your button",
  messages:    "These are your three messages",
  themeColor:  "This sets your app's color",
  widget:      "This is the footer credit",
};

// Returns the marker string for a given field and experience type
// experience: "webpage" | "app"
export function getHighlightKey(fieldName, experience) {
  const map = experience === "app" ? APP_MARKERS : WEBPAGE_MARKERS;
  return map[fieldName] || null;
}
