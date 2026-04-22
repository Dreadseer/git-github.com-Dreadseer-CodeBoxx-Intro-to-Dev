// getHighlightKey.js — Maps a changed field or widget to the matching comment markers in the generated code.
// Returns a string for field changes, an array of strings for widget changes, or null if no match.

// Experience 1 field → marker mappings
const WEBPAGE_FIELD_MARKERS = {
  name:       "This displays your name",
  dreamJob:   "This displays your dream job",
  bio:        "This displays your bio",
  themeColor: "This sets your page's color",
  avatar:     "This is your header bar with your chosen icon",
};

// Experience 2 field → marker mappings
const APP_FIELD_MARKERS = {
  appTitle:    "This is your app title",
  buttonLabel: "This is your button",
  messages:    "These are your three messages",
  themeColor:  "This sets your app's color",
};

// Widget type → comment marker in generated HTML
const WIDGET_TYPE_MARKERS = {
  heading:     "Custom heading widget",
  button:      "Custom button widget",
  contact:     "Contact form widget",
  message_box: "Message box widget",
  social:      "Social links widget",
};

// Widget slot → comment marker in generated HTML
const SLOT_MARKERS = {
  top:          "Top widgets",
  after_header: "After header widgets",
  bottom:       "Bottom widgets",
};

// Returns a string, an array of strings, or null
// experience: "webpage" | "app"
export function getHighlightKey(lastChanged, experience) {
  // No change yet
  if (!lastChanged) return null;

  // Widget change — return both the slot marker and the widget type marker
  if (typeof lastChanged === "object" && lastChanged.kind === "widget") {
    const slotMarker = SLOT_MARKERS[lastChanged.slot] || null;
    const typeMarker = WIDGET_TYPE_MARKERS[lastChanged.widgetType] || null;
    return [slotMarker, typeMarker].filter(Boolean);
  }

  // Plain field change — return the single matching marker string
  const map = experience === "app" ? APP_FIELD_MARKERS : WEBPAGE_FIELD_MARKERS;
  return map[lastChanged] || null;
}
