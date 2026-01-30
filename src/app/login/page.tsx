"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignUp = async () => {
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to confirm your account.");
    }
    setBusy(false);
  };

  const handleSignIn = async () => {
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed in. You can head back to the reviews.");
    }
    setBusy(false);
  };

  const handleGoogle = async () => {
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Student Access
            </p>
            <h1 className="font-[family:var(--font-display)] text-5xl tracking-wide">
              Sign In or Create an Account
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--stroke)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            Back to Site
          </Link>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
            <h2 className="text-2xl font-semibold">Email Sign In</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Use email + password to sign in or sign up.
            </p>
            <div className="mt-6 space-y-4">
              <input
                className="w-full rounded-2xl border border-[var(--stroke)] bg-transparent px-4 py-3 text-sm"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className="w-full rounded-2xl border border-[var(--stroke)] bg-transparent px-4 py-3 text-sm"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSignIn}
                  disabled={busy}
                  className="rounded-full bg-[var(--accent)] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  disabled={busy}
                  className="rounded-full border border-[var(--stroke)] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Sign Up
                </button>
              </div>
              {message ? (
                <p className="text-sm text-[var(--muted)]">{message}</p>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
            <h2 className="text-2xl font-semibold">Google Sign In</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Admin access requires Google OAuth.
            </p>
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black"
            >
              Continue with Google
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
