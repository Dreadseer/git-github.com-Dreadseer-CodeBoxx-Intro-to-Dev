# 📧 FEATURE SPEC — Email Submission & Lead Capture

> **Read `ai-spec.md` first.** This file defines only what is specific to the email submission feature.
> The global spec overrides anything here in case of conflict.

---

## Purpose

After completing their experience, students can submit their name and email to receive their generated code by email. They can also opt into follow-up outreach from CodeBoxx and must acknowledge a data retention disclosure. The form captures a warm lead for the recruitment team while giving the student something tangible to take away — their own working HTML file in their inbox.

---

## Recommended Email Service: Resend

**Use Resend** (`resend.com`). Reasons:

- Free tier: 3,000 emails/month — more than sufficient for events
- First-class Next.js support with an official SDK
- Supports HTML email bodies and file attachments
- Simple API key setup — no domain verification required for the free tier sending from `onboarding@resend.dev`
- Install: `npm install resend`

> When ready for production, verify a custom domain (e.g. `hello@codeboxx.ca`) in the Resend dashboard and update `RESEND_FROM_EMAIL` accordingly.

---

## New Environment Variables

Add to `.env.local`:

```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_COPY=recruiter@codeboxx.ca
```

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key — server-side only, never expose to client |
| `RESEND_FROM_EMAIL` | The sender address shown in the student's inbox |
| `RESEND_TO_COPY` | CodeBoxx internal address that receives a copy of every submission |

> `RESEND_API_KEY` must NOT have the `NEXT_PUBLIC_` prefix — it is a secret and must stay server-side only.

---

## Where It Appears

The submission form appears **below the `CodeBoxxCTA` component** on both result screens:

- `src/app/experience/webpage/result/page.jsx`
- `src/app/experience/app/result/page.jsx`

---

## New Files

| File | Purpose |
|---|---|
| `src/components/shared/EmailSubmissionForm.jsx` | The student-facing form component |
| `src/app/api/send-code/route.js` | Next.js API route — handles email sending via Resend |

---

## Component: `EmailSubmissionForm`

**File:** `src/components/shared/EmailSubmissionForm.jsx`

**Props:**
| Prop | Type | Required | Description |
|---|---|---|---|
| `generatedCode` | string | Yes | The full HTML string from `generateWebPageCode` or `generateAppCode` |
| `experience` | string | Yes | `"webpage"` or `"app"` — used to label the email subject |
| `studentName` | string | Yes | Pre-filled from `formData.name` or `formData.appTitle` — editable |

---

### Form Fields

1. **Name input**
   - Label: `"Your name"`
   - Pre-filled with `studentName` prop
   - Required — submit button disabled if empty

2. **Email input**
   - Label: `"Your email"`
   - Type: `email`
   - Placeholder: `"you@example.com"`
   - Required — submit button disabled if empty or invalid format

3. **Checkboxes (all optional)**

   **Checkbox A — Recruitment opt-in:**
   - Label: `"I'd love CodeBoxx to reach out about programs and opportunities"`
   - Key: `optInRecruitment`
   - Default: unchecked

   **Checkbox B — School info opt-in:**
   - Label: `"Send me information about CodeBoxx's school recruitment programs"`
   - Key: `optInSchoolInfo`
   - Default: unchecked

   **Checkbox C — Data retention acknowledgement:**
   - Label: `"I understand my name and email will be stored securely by CodeBoxx Academy for school recruitment purposes only"`
   - Key: `acknowledgeDataRetention`
   - Default: unchecked
   - Styled differently — slightly more prominent, with a gray background pill to distinguish it as a disclosure

4. **Submit button**
   - Label: `"Email Me My Code →"`
   - Disabled when `name` or `email` is empty
   - Shows loading state: `"Sending..."` while the API call is in flight
   - Style: full-width, CodeBoxx yellow, same as `PrimaryButton`

5. **Success state**
   - Replaces the form after successful submission
   - Message: `"✅ Sent! Check your inbox — your code is on its way."`
   - Sub-message: `"Thanks for building with CodeBoxx today."`
   - Style: green-tinted card, centered

6. **Error state**
   - Shown inline below the submit button if the API call fails
   - Message: `"Something went wrong. Please try again."`
   - Style: small red text

---

### Form State

```js
const [name, setName] = useState(studentName);
const [email, setEmail] = useState("");
const [optInRecruitment, setOptInRecruitment] = useState(false);
const [optInSchoolInfo, setOptInSchoolInfo] = useState(false);
const [acknowledgeDataRetention, setAcknowledgeDataRetention] = useState(false);
const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"
```

### Submit Handler

```js
async function handleSubmit() {
  setStatus("sending");
  try {
    const response = await fetch("/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        experience,
        generatedCode,
        optInRecruitment,
        optInSchoolInfo,
        acknowledgeDataRetention,
      }),
    });
    if (!response.ok) throw new Error("Send failed");
    setStatus("success");
  } catch {
    setStatus("error");
  }
}
```

---

### Full File

**`src/components/shared/EmailSubmissionForm.jsx`**
```jsx
// EmailSubmissionForm.jsx — Lets students email themselves their generated code.
// Also captures opt-in preferences and data retention acknowledgement for CodeBoxx.

"use client";

import { useState } from "react";

export default function EmailSubmissionForm({ generatedCode, experience, studentName }) {
  const [name, setName] = useState(studentName || "");
  const [email, setEmail] = useState("");
  const [optInRecruitment, setOptInRecruitment] = useState(false);
  const [optInSchoolInfo, setOptInSchoolInfo] = useState(false);
  const [acknowledgeDataRetention, setAcknowledgeDataRetention] = useState(false);
  const [status, setStatus] = useState("idle");

  const isReady = name.trim() !== "" && email.trim() !== "" && status !== "sending";

  async function handleSubmit() {
    setStatus("sending");
    try {
      const response = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          experience,
          generatedCode,
          optInRecruitment,
          optInSchoolInfo,
          acknowledgeDataRetention,
        }),
      });
      if (!response.ok) throw new Error("Send failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Success state — replaces the form
  if (status === "success") {
    return (
      <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-6 mt-4 mb-8 text-center">
        <p className="text-xl font-bold text-green-800">✅ Sent!</p>
        <p className="text-sm text-green-700 mt-1">
          Check your inbox — your code is on its way.
        </p>
        <p className="text-xs text-green-600 mt-3">
          Thanks for building with CodeBoxx today.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 mt-4 mb-8">

      {/* Section heading */}
      <p className="text-lg font-bold text-gray-900 mb-1">
        Email me my code
      </p>
      <p className="text-sm text-gray-500 mb-5">
        We'll send your working HTML file straight to your inbox.
      </p>

      {/* Name input */}
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-semibold text-gray-700">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Email input */}
      <div className="flex flex-col gap-1 mb-6">
        <label className="text-sm font-semibold text-gray-700">Your email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Opt-in checkboxes */}
      <div className="flex flex-col gap-4 mb-6">

        {/* Checkbox A — Recruitment opt-in */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optInRecruitment}
            onChange={(e) => setOptInRecruitment(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-yellow-400"
          />
          <span className="text-sm text-gray-600">
            I'd love CodeBoxx to reach out about programs and opportunities
          </span>
        </label>

        {/* Checkbox B — School info opt-in */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optInSchoolInfo}
            onChange={(e) => setOptInSchoolInfo(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-yellow-400"
          />
          <span className="text-sm text-gray-600">
            Send me information about CodeBoxx's school recruitment programs
          </span>
        </label>

        {/* Checkbox C — Data retention disclosure */}
        <label className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledgeDataRetention}
            onChange={(e) => setAcknowledgeDataRetention(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-yellow-400"
          />
          <span className="text-xs text-gray-500">
            I understand my name and email will be stored securely by CodeBoxx
            Academy for school recruitment purposes only
          </span>
        </label>

      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isReady}
        className={`w-full bg-yellow-400 text-gray-900 font-bold text-lg py-4 rounded-2xl ${
          !isReady ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        {status === "sending" ? "Sending..." : "Email Me My Code →"}
      </button>

      {/* Error message */}
      {status === "error" && (
        <p className="text-sm text-red-500 text-center mt-3">
          Something went wrong. Please try again.
        </p>
      )}

    </div>
  );
}
```

---

## API Route: `/api/send-code`

**File:** `src/app/api/send-code/route.js`

**Method:** POST

**Request body:**
```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "experience": "webpage",
  "generatedCode": "<!DOCTYPE html>...",
  "optInRecruitment": true,
  "optInSchoolInfo": false,
  "acknowledgeDataRetention": true
}
```

**What it does:**
1. Validates that `name`, `email`, and `generatedCode` are present
2. Sends an email to the student via Resend with:
   - Subject: `"Your CodeBoxx [Web Page / App] — built by [name]"`
   - HTML body: welcome message + the generated code in a `<pre>` block
   - Attachment: the generated code as `my-codeboxx-[webpage/app].html`
3. Sends a copy to `RESEND_TO_COPY` with the student's opt-in preferences included
4. Returns `200` on success, `400` on missing fields, `500` on send failure

### Email to Student — HTML Body Structure

```html
<h2>Hey [name] 👋</h2>
<p>Here's the code you built at CodeBoxx today. Open the attached <strong>.html file</strong> in any browser to see it live.</p>
<p>Want to keep building? Visit <a href="https://codeboxx.ca">codeboxx.ca</a> to learn more.</p>
<hr />
<h3>Your code:</h3>
<pre style="background:#1f2937;color:#f9fafb;padding:24px;border-radius:8px;font-size:12px;overflow:auto;">
[generatedCode inserted here — HTML-escaped]
</pre>
<hr />
<p style="font-size:11px;color:#9ca3af;">
  Sent by CodeBoxx Academy · Your email was collected for school recruitment purposes only.
</p>
```

### Email to CodeBoxx Internal Copy

```html
<h3>New CodeBoxx Event Submission</h3>
<p><strong>Name:</strong> [name]</p>
<p><strong>Email:</strong> [email]</p>
<p><strong>Experience:</strong> [experience]</p>
<p><strong>Opt-in — Recruitment:</strong> [Yes / No]</p>
<p><strong>Opt-in — School Info:</strong> [Yes / No]</p>
<p><strong>Data Retention Acknowledged:</strong> [Yes / No]</p>
```

### Full File

**`src/app/api/send-code/route.js`**
```js
// route.js — API route that handles sending the student's generated code via Resend.
// Also sends a copy to CodeBoxx with the student's opt-in preferences.

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      experience,
      generatedCode,
      optInRecruitment,
      optInSchoolInfo,
      acknowledgeDataRetention,
    } = body;

    // Validate required fields
    if (!name || !email || !generatedCode) {
      return Response.json(
        { error: "Missing required fields: name, email, or generatedCode" },
        { status: 400 }
      );
    }

    // Build the subject and file name based on which experience they completed
    const experienceLabel = experience === "app" ? "App" : "Web Page";
    const fileName = experience === "app"
      ? "my-codeboxx-app.html"
      : "my-codeboxx-webpage.html";

    // Escape HTML special characters so the code displays safely inside a <pre> block
    const escapedCode = generatedCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Send email to the student
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: `Your CodeBoxx ${experienceLabel} — built by ${name}`,
      html: `
        <h2>Hey ${name} 👋</h2>
        <p>Here's the code you built at CodeBoxx today. Open the attached <strong>.html file</strong> in any browser to see it live.</p>
        <p>Want to keep building? Visit <a href="https://codeboxx.ca">codeboxx.ca</a> to learn more.</p>
        <hr />
        <h3>Your code:</h3>
        <pre style="background:#1f2937;color:#f9fafb;padding:24px;border-radius:8px;font-size:12px;overflow:auto;">${escapedCode}</pre>
        <hr />
        <p style="font-size:11px;color:#9ca3af;">
          Sent by CodeBoxx Academy &middot; Your email was collected for school recruitment purposes only.
        </p>
      `,
      attachments: [
        {
          filename: fileName,
          // Resend expects base64-encoded attachment content
          content: Buffer.from(generatedCode).toString("base64"),
        },
      ],
    });

    // Send internal copy to CodeBoxx with opt-in preferences
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RESEND_TO_COPY,
      subject: `[CodeBoxx Event] New submission from ${name}`,
      html: `
        <h3>New CodeBoxx Event Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Experience:</strong> ${experienceLabel}</p>
        <p><strong>Opt-in — Recruitment:</strong> ${optInRecruitment ? "Yes" : "No"}</p>
        <p><strong>Opt-in — School Info:</strong> ${optInSchoolInfo ? "Yes" : "No"}</p>
        <p><strong>Data Retention Acknowledged:</strong> ${acknowledgeDataRetention ? "Yes" : "No"}</p>
      `,
    });

    return Response.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Email send error:", error);
    return Response.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
```

---

## Integration on Result Pages

Both result pages must import and render `EmailSubmissionForm` below `CodeBoxxCTA`.

### In `src/app/experience/webpage/result/page.jsx`:
```jsx
import EmailSubmissionForm from "@/components/shared/EmailSubmissionForm";

// Add below <CodeBoxxCTA />:
<EmailSubmissionForm
  generatedCode={generatedCode}
  experience="webpage"
  studentName={formData.name}
/>
```

### In `src/app/experience/app/result/page.jsx`:
```jsx
import EmailSubmissionForm from "@/components/shared/EmailSubmissionForm";

// Add below <CodeBoxxCTA />:
<EmailSubmissionForm
  generatedCode={generatedCode}
  experience="app"
  studentName={formData.appTitle}
/>
```

---

## Vercel Environment Variables

Add all three variables in the Vercel dashboard under **Settings → Environment Variables**:

```
RESEND_API_KEY         → your Resend API key
RESEND_FROM_EMAIL      → onboarding@resend.dev  (or your verified domain)
RESEND_TO_COPY         → recruiter@codeboxx.ca
```

---

## Acceptance Criteria

- [ ] `npm install resend` has been run and `resend` appears in `package.json`
- [ ] `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_COPY` are in `.env.local`
- [ ] `RESEND_API_KEY` does NOT have the `NEXT_PUBLIC_` prefix
- [ ] `EmailSubmissionForm` appears below `CodeBoxxCTA` on both result screens
- [ ] Name field is pre-filled with the student's name from context
- [ ] Submit button is disabled when name or email is empty
- [ ] Submit button shows `"Sending..."` while the API call is in flight
- [ ] On success, the form is replaced with the green success card
- [ ] On failure, the red error message appears below the submit button
- [ ] The student receives an email with the generated code in the body and as an `.html` attachment
- [ ] CodeBoxx receives an internal copy with the student's name, email, experience, and all three opt-in values
- [ ] All three checkboxes are unchecked by default
- [ ] The data retention checkbox has a distinct gray background pill styling
- [ ] No API key or secret is exposed to the client (no `NEXT_PUBLIC_RESEND_*`)
- [ ] No console errors or warnings on either result screen
