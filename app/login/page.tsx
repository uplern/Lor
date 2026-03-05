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
    <main className="container page">
      <form className="card form-grid" onSubmit={onSubmit} style={{ maxWidth: "460px", margin: "0 auto" }}>
        <h2 className="panel-title">Admin Login</h2>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            suppressHydrationWarning
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            suppressHydrationWarning
          />
        </div>

        <button className="btn" type="submit" disabled={loading} suppressHydrationWarning>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {error ? <p className="error">{error}</p> : null}
      </form>
    </main>
  );
}