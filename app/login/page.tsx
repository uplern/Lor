"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const userId = signInData.user?.id;
      if (!userId) {
        setError("Login succeeded but user session is missing. Please retry.");
        return;
      }

      const { data: adminRecord, error: adminError } = await supabase
        .from("admins")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (adminError) {
        setError(`Signed in, but admin check failed: ${adminError.message}`);
        return;
      }

      if (!adminRecord) {
        setError("Signed in, but this account is not in public.admins.");
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-backdrop">
        {/* decorative shapes */}
        <div className="login-deco login-deco-1" />
        <div className="login-deco login-deco-2" />
        <div className="login-deco login-deco-3" />
      </div>

      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-card-icon">
            <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="var(--accent)" opacity="0.12" />
              <path
                d="M24 14a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-8 18c0-3 5.33-5 8-5s8 2 8 5v1H16v-1Z"
                fill="var(--accent)"
              />
            </svg>
          </div>

          <h2 className="login-title">Admin Portal</h2>
          <p className="login-subtitle">Sign in to manage users, templates, and LOR records.</p>

          <form className="login-form" onSubmit={onSubmit}>
            <div className="vp-field">
              <label htmlFor="email">Email</label>
              <div className="vp-input-wrap">
                <svg className="vp-input-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" /></svg>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@uplern.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="vp-field">
              <label htmlFor="password">Password</label>
              <div className="vp-input-wrap">
                <svg className="vp-input-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9V6Zm9 14H6V10h12v10Zm-6-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>

            <button className="btn vp-submit-btn" type="submit" disabled={loading} suppressHydrationWarning>
              {loading ? (
                <>
                  <span className="vp-spinner" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {error ? <p className="vp-error">{error}</p> : null}
          </form>
        </div>
      </div>
    </main>
  );
}