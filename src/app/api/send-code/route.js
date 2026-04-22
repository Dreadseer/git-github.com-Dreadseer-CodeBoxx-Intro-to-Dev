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
