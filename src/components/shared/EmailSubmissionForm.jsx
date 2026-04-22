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
