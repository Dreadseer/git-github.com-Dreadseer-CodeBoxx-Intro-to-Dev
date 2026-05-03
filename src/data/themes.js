export const THEME_COLORS = {
  purple: { label: "Purple", hex: "#7C3AED", text: "#ffffff" },
  blue:   { label: "Blue",   hex: "#2563EB", text: "#ffffff" },
  teal:   { label: "Teal",   hex: "#0D9488", text: "#ffffff" },
  orange: { label: "Orange", hex: "#EA580C", text: "#ffffff" },
  pink:   { label: "Pink",   hex: "#DB2777", text: "#ffffff" },
  slate:  { label: "Slate",  hex: "#475569", text: "#ffffff" },
};

export const DEFAULT_THEME = "purple";

// Font pairings: { label, display, body, cssImport }
// display = used for headings, body = used for paragraphs/copy
export const FONT_PAIRINGS = {
  modern: {
    label: "Modern",
    display: "'DM Sans', sans-serif",
    body: "'DM Sans', sans-serif",
    cssImport: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap",
  },
  classic: {
    label: "Classic",
    display: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
    cssImport: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap",
  },
  bold: {
    label: "Bold",
    display: "'Syne', sans-serif",
    body: "'Inter', sans-serif",
    cssImport: "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500&display=swap",
  },
  friendly: {
    label: "Friendly",
    display: "'Nunito', sans-serif",
    body: "'Nunito', sans-serif",
    cssImport: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap",
  },
};

export const DEFAULT_FONT_PAIRING = "modern";
