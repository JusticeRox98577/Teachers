"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setEmail(data.session?.user?.email ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          ISD School District
        </p>
        <h1 className="font-[family:var(--font-display)] text-6xl tracking-wide">
          ISD Teachers
        </h1>
      </div>
      <nav className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin"
          className="rounded-full border border-[var(--stroke)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          Admin
        </Link>
        {email ? (
          <button
            onClick={handleSignOut}
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
