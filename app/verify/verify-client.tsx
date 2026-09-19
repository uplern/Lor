"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import LORPreview from "@/components/LORPreview";
import type { VerifyResponse } from "@/types/db";

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="vp-steps">
      <div className={`vp-step ${step >= 1 ? "vp-step-active" : ""}`}>
        <span className="vp-step-num">1</span>
        <span className="vp-step-label">Verify Identity</span>
      </div>
      <div className="vp-step-line" />
      <div className={`vp-step ${step >= 2 ? "vp-step-active" : ""}`}>
        <span className="vp-step-num">2</span>
        <span className="vp-step-label">Preview & Download</span>
      </div>
    </div>
  );
}

export default function VerifyClientPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const body = token ? { token } : { name, email };

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    setLoading(false);

    if (!res.ok) {
      const payload = await res.json().catch(() => ({ error: "Unable to verify" }));
      setError(payload.error || "Unable to verify");
      return;
    }

    const payload = (await res.json()) as VerifyResponse;
    setResult(payload);
  }

  return (
    <main className="vp-page">
      {/* LEFT decorative panel */}
      <aside className="vp-sidebar">
        <div className="vp-sidebar-content">
          <div className="vp-sidebar-icon">
            <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
              <rect x="8" y="4" width="48" height="56" rx="6" fill="none" stroke="#fff" strokeWidth="2.5" />
              <path d="M20 20h24M20 28h24M20 36h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <circle cx="44" cy="44" r="14" fill="var(--accent)" />
              <path d="M38 44l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h2>Verify & Get Your LOR</h2>
          <p>Enter your details to retrieve your verified, QR-secured Letter of Recommendation from Uplern.</p>

          <div className="vp-sidebar-features">
            <div className="vp-sidebar-feat">
              <span className="vp-feat-dot" />
              Officially verified records
            </div>
            <div className="vp-sidebar-feat">
              <span className="vp-feat-dot" />
              QR code for authenticity
            </div>
            <div className="vp-sidebar-feat">
              <span className="vp-feat-dot" />
              Download print-ready PDF
            </div>
          </div>
        </div>

        {/* decorative shapes */}
        <div className="vp-deco-circle vp-deco-1" />
        <div className="vp-deco-circle vp-deco-2" />
      </aside>

      {/* RIGHT content */}
      <div className="vp-main">
        <StepIndicator step={result ? 2 : 1} />

        {!result ? (
          <form className="vp-card" onSubmit={onSubmit}>
            <h2 className="vp-card-title">
              {token ? "Token Detected" : "Enter Your Details"}
            </h2>
            <p className="vp-card-subtitle">
              {token
                ? "Your secure token has been detected. Click below to retrieve your letter."
                : "Provide the name and email you used during your internship registration."
              }
            </p>

            {token ? null : (
              <>
                <div className="vp-field">
                  <label htmlFor="name">Full Name</label>
                  <div className="vp-input-wrap">
                    <svg className="vp-input-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8v-1c0-2.66 5.33-4 7-4s7 1.34 7 4v1H5Z" /></svg>
                    <input
                      id="name"
                      placeholder="e.g. Ravi Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div className="vp-field">
                  <label htmlFor="email">Email Address</label>
                  <div className="vp-input-wrap">
                    <svg className="vp-input-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" /></svg>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. ravi@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              </>
            )}

            <button className="btn vp-submit-btn" type="submit" disabled={loading} suppressHydrationWarning>
              {loading ? (
                <>
                  <span className="vp-spinner" />
                  Verifying…
                </>
              ) : (
                "Get My LOR"
              )}
            </button>

            {error ? <p className="vp-error">{error}</p> : null}
          </form>
        ) : (
          <div className="vp-preview-wrap">
            <LORPreview
              initialContent={result.content}
              verifyToken={result.verify_token}
              userName={result.user.name}
            />
          </div>
        )}
      </div>
    </main>
  );
}