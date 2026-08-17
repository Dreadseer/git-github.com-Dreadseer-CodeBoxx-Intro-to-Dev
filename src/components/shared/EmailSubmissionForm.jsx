// EmailSubmissionForm.jsx — Lets students beam their generated code to their inbox.
// Also captures opt-in preferences and data retention acknowledgement for CodeBoxx.

"use client";

import { useState } from "react";

const inputClasses =
  "bg-ink-950 border border-line-strong rounded-xl px-4 py-3 text-base text-fg " +
  "placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-accent";

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
      <div className="w-full bg-ink-900 border border-ok/40 rounded-2xl p-6 mt-4 mb-8 text-center">
        <p className="sys text-[10px] text-ok mb-2">TRANSMISSION SENT</p>
        <p className="text-lg font-bold text-fg">Your code is on its way.</p>
        <p className="text-sm text-fg-mid mt-1">
          Check your inbox — open the attached file in any browser and your
          creation runs, anywhere, forever.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-ink-900 border border-line rounded-2xl p-6 mt-4 mb-8">

      {/* Section heading */}
      <p className="sys text-[10px] text-accent mb-2">SAVE YOUR BUILD</p>
      <p className="text-lg font-bold text-fg mb-1">Email me my code</p>
      <p className="text-sm text-fg-dim mb-5">
        We'll send your working HTML file straight to your inbox.
      </p>

      {/* Name input */}
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-semibold text-fg-mid">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClasses}
        />
      </div>

      {/* Email input */}
      <div className="flex flex-col gap-1 mb-6">
        <label className="text-sm font-semibold text-fg-mid">Your email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClasses}
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
            className="mt-0.5 w-5 h-5 rounded accent-accent"
          />
          <span className="text-sm text-fg-mid">
            I&apos;d love CodeBoxx to reach out about programs and opportunities
          </span>
        </label>

        {/* Checkbox B — School info opt-in */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optInSchoolInfo}
            onChange={(e) => setOptInSchoolInfo(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-accent"
          />
          <span className="text-sm text-fg-mid">
            Send me information about CodeBoxx&apos;s school recruitment programs
          </span>
        </label>

        {/* Checkbox C — Data retention disclosure */}
        <label className="flex items-start gap-3 bg-ink-950 border border-line rounded-xl p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledgeDataRetention}
            onChange={(e) => setAcknowledgeDataRetention(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-accent"
          />
          <span className="text-xs text-fg-dim">
            I understand my name and email will be stored securely by CodeBoxx
            Academy for school recruitment purposes only
          </span>
        </label>

      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isReady}
        className={`w-full bg-accent text-on-accent font-bold text-lg py-4 rounded-xl
          transition-transform duration-150 ${
            !isReady ? "opacity-30 cursor-not-allowed" : "active:scale-[0.98]"
          }`}
      >
        {status === "sending" ? "Sending..." : "Email Me My Code →"}
      </button>

      {/* Error message */}
      {status === "error" && (
        <p className="text-sm text-danger text-center mt-3">
          Something went wrong. Please try again.
        </p>
      )}

    </div>
  );
}
