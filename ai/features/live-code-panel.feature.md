# 💻 FEATURE SPEC — Live "See the Code" Panel on Builder Pages

> **Read `ai-spec.md` first.** This file defines only what is specific to this feature.
> The global spec overrides anything here in case of conflict.

---

## Purpose

Students currently only see the generated code on the result screen — after they're done building. This feature adds a live "See the Code" panel directly on the builder pages, open by default, so students can watch their code update in real time as they fill out fields and add widgets. This is the clearest possible demonstration of the connection between what they're building and the code behind it.

---

## Affected Pages

| Page | File |
|---|---|
| Web Page Builder | `src/app/experience/webpage/page.jsx` |
| App Builder | `src/app/experience/app/page.jsx` |

---

## Behaviour

- The `SeeTheCodePanel` already exists and works — this feature reuses it as-is
- On the builder pages it is **open by default** (`isOpen` starts as `true`)
- It updates live because it reads from context, which updates on every keystroke and widget change
- The generated code string is regenerated on every render pass — this is intentional and fine for this use case
- The `highlightKey` from `code-highlighting.feature.md` is passed in so highlighting works here too
- The panel sits **below the live preview and widget panel**, above the bottom of the page
- A small label above it reads: `"Your code updates as you build"`

---

## Key Difference From Result Screen

| | Builder Page | Result Screen |
|---|---|---|
| Default state | **Open** | Collapsed |
| Label above panel | `"Your code updates as you build"` | None (intro sentence inside panel) |
| `highlightKey` | Passed from `formData.lastChanged` | Passed from `formData.lastChanged` |
| Code source | Generated fresh each render | Generated once on result page render |

---

## Required Change to `SeeTheCodePanel`

`SeeTheCodePanel` currently hardcodes `isOpen` starting as `false`. To support both use cases it needs a new optional prop: `defaultOpen`.

### Updated prop:

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `code` | string | Yes | — | The generated HTML string |
| `highlightKey` | string | No | `null` | The marker string for the highlighted section |
| `defaultOpen` | boolean | No | `false` | If `true`, panel starts expanded |

### Updated `SeeTheCodePanel` init line only:

```jsx
// Change this:
const [isOpen, setIsOpen] = useState(false);

// To this:
const [isOpen, setIsOpen] = useState(defaultOpen);
```

And update the function signature:
```jsx
export default function SeeTheCodePanel({ code, highlightKey = null, defaultOpen = false }) {
```

No other changes to `SeeTheCodePanel` are needed.

---

## Changes to Builder Pages

Both `src/app/experience/webpage/page.jsx` and `src/app/experience/app/page.jsx` need the following additions.

### New imports:

```jsx
import SeeTheCodePanel from "@/components/shared/SeeTheCodePanel";
import { generateWebPageCode } from "@/utils/generateWebPageCode"; // webpage only
import { generateAppCode } from "@/utils/generateAppCode";         // app only
import { getHighlightKey } from "@/utils/getHighlightKey";
```

### New derived values (inside the component, before the return):

```jsx
// For webpage/page.jsx:
const { formData, updateField, addWidget, removeWidget, updateWidget, moveWidget } = useWebPage();
const generatedCode = generateWebPageCode(formData);
const highlightKey = getHighlightKey(formData.lastChanged, "webpage");

// For app/page.jsx:
const { formData, updateField, updateMessage, addWidget, removeWidget, updateWidget, moveWidget } = useAppBuilder();
const generatedCode = generateAppCode(formData);
const highlightKey = getHighlightKey(formData.lastChanged, "app");
```

### New JSX block added after `WidgetPanel` and `WidgetEditor`, before the closing `</PageShell>`:

```jsx
{/* Live code panel — open by default so students see their code updating */}
<div className="mt-6">
  <p className="text-xs text-center text-gray-400 mb-2">
    Your code updates as you build
  </p>
  <SeeTheCodePanel
    code={generatedCode}
    highlightKey={highlightKey}
    defaultOpen={true}
  />
</div>
```

---

## Generated Code Must Include Widgets

The live code panel shows the output of `generateWebPageCode` or `generateAppCode`. Currently those utilities do not include widget output in the generated HTML. They must be updated to append widget HTML to the generated output so the code panel reflects the full page the student is building.

### Updates to `generateWebPageCode`

Add a widget serialization section at the end of the generated HTML, just before `</body>`. Widgets are grouped by slot and rendered as commented HTML blocks.

```js
// Add this function inside generateWebPageCode.js
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
```

Then inside the main `generateWebPageCode` template string, add the slot sections at the correct positions:

```js
// Inside the return template string, add before </body>:
${widgetsToHTML(widgets, "top") ? `\n  <!-- Top widgets -->\n${widgetsToHTML(widgets, "top")}` : ""}

// After the header div line, add:
${widgetsToHTML(widgets, "after_header") ? `\n  <!-- After header widgets -->\n${widgetsToHTML(widgets, "after_header")}` : ""}

// Before the footer <p>, add:
${widgetsToHTML(widgets, "bottom") ? `\n  <!-- Bottom widgets -->\n${widgetsToHTML(widgets, "bottom")}` : ""}
```

Apply the same pattern to `generateAppCode` for the App Builder experience.

---

## Scroll Behaviour

Because the live code panel is open and updating, the `CodeBlock` auto-scroll (from `code-highlighting.feature.md`) will fire whenever `highlightKey` changes — scrolling the highlighted section into view inside the panel. This is the correct and desired behaviour on the builder page.

The `max-h-[400px]` on the `CodeBlock` scroll container (from the highlighting spec) ensures the panel doesn't grow to an unmanageable height on the builder page.

---

## Acceptance Criteria

- [ ] `SeeTheCodePanel` accepts a `defaultOpen` prop and initialises `isOpen` from it
- [ ] The live code panel appears on both builder pages below the widget panel
- [ ] The panel is open by default on the builder pages
- [ ] The label `"Your code updates as you build"` appears above the panel
- [ ] The generated code updates immediately when any form field is changed
- [ ] The generated code updates immediately when a widget is added, edited, or removed
- [ ] Widget HTML is included in the generated code output for all 5 widget types
- [ ] Widgets appear in the correct slot position in the generated HTML (top / after_header / bottom comments)
- [ ] The highlighted section scrolls into view when a field or widget is changed
- [ ] The panel can still be collapsed and expanded by tapping the header
- [ ] The result screen `SeeTheCodePanel` remains collapsed by default (no regression)
- [ ] No console errors or warnings on either builder page
