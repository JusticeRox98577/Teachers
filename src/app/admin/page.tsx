import Link from "next/link";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail, isGoogleProvider } from "@/lib/auth";
import { approveReview, rejectReview } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-10 shadow-[var(--shadow)]">
          <h1 className="font-[family:var(--font-display)] text-4xl tracking-wide">
            Admin Access
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Sign in with Google to review and approve submissions.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const isAdmin =
    isAdminEmail(user.email) && isGoogleProvider(user.app_metadata?.provider);

  if (!isAdmin) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-10 shadow-[var(--shadow)]">
          <h1 className="font-[family:var(--font-display)] text-4xl tracking-wide">
            Access Denied
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            This page is limited to approved admin Google accounts.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-[var(--stroke)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            Back to Reviews
          </Link>
        </div>
      </main>
    );
  }

  const adminClient = createAdminClient();
  const { data: reviews } = await adminClient
    .from("reviews")
    .select(
      "id, school, teacher_name, subject, rating, nickname, review_text, created_at"
    )
    .eq("is_approved", false)
    .eq("is_rejected", false)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Admin Control Room
            </p>
            <h1 className="font-[family:var(--font-display)] text-5xl tracking-wide">
              Review Queue
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--stroke)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            Back to Site
          </Link>
        </header>

        <section className="mt-10 space-y-6">
          {(reviews ?? []).length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[var(--stroke)] p-10 text-center text-[var(--muted)]">
              No pending reviews right now.
            </div>
          ) : (
            (reviews ?? []).map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-[var(--shadow)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                      {review.school}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {review.teacher_name}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      {review.subject} • {review.rating}/5 • {review.nickname}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <form action={approveReview}>
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button className="rounded-full bg-[var(--accent-2)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                        Approve
                      </button>
                    </form>
                    <form action={rejectReview}>
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button className="rounded-full border border-[var(--stroke)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
                {review.review_text ? (
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    “{review.review_text}”
                  </p>
                ) : null}
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
