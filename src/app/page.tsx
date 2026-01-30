import Header from "@/components/Header";
import ReviewsBoard from "@/components/ReviewsBoard";

export default function Home() {
  return (
    <main className="texture min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Header />

        <section className="mt-8 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Student-led ratings
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Honest reviews for ISD teachers
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
                Share what helps you learn, highlight stand-out teachers, and
                keep it respectful. Every review goes through admin approval
                before it appears publicly.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--stroke)] bg-[#0f1016] px-6 py-4 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Skyline • Issaquah • Liberty
            </div>
          </div>
        </section>

        <ReviewsBoard />

        <footer className="mt-12 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Built for the ISD community • Reviews are moderated •
          idsteachers.org
        </footer>
      </div>
    </main>
  );
}
