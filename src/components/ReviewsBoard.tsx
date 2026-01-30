"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";

const schools = [
  "Skyline High School",
  "Issaquah High School",
  "Liberty High School",
];

const ratingLabels = ["1", "2", "3", "4", "5"];

export default function ReviewsBoard() {
  const [activeSchool, setActiveSchool] = useState(schools[0]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [teacherName, setTeacherName] = useState("");
  const [subject, setSubject] = useState("");
  const [rating, setRating] = useState("5");
  const [nickname, setNickname] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchReviews = async (school: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/reviews?school=${encodeURIComponent(school)}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load reviews.");
      }
      setReviews(data.reviews ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(activeSchool);
  }, [activeSchool]);

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);

    const payload = {
      school: activeSchool,
      teacher_name: teacherName,
      subject,
      rating: Number(rating),
      nickname,
      review_text: reviewText,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setTeacherName("");
      setSubject("");
      setRating("5");
      setNickname("");
      setReviewText("");
      setNotice("Thanks! Your review is pending admin approval.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <div className="flex flex-wrap gap-3">
          {schools.map((school) => (
            <button
              key={school}
              onClick={() => setActiveSchool(school)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                activeSchool === school
                  ? "bg-[var(--accent)] text-black"
                  : "border border-[var(--stroke)] text-[var(--muted)]"
              }`}
            >
              {school.replace(" High School", "")}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Review Feed
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{activeSchool}</h2>
            </div>
            <span className="rounded-full border border-[var(--stroke)] px-4 py-1 text-xs text-[var(--muted)]">
              {reviews.length} approved
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {loading ? (
              <p className="text-sm text-[var(--muted)]">Loading reviews...</p>
            ) : error ? (
              <p className="text-sm text-red-300">{error}</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No approved reviews yet. Be the first to leave one.
              </p>
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-[var(--stroke)] bg-[#0f1016] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">
                      {review.teacher_name}
                    </h3>
                    <span className="text-xs text-[var(--muted)]">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                    {review.subject} • {review.nickname}
                  </p>
                  {review.review_text ? (
                    <p className="mt-3 text-sm text-[var(--muted)]">
                      “{review.review_text}”
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          Leave a Review
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Tell your story</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Anonymous reviews are allowed. Every submission is reviewed before it
          goes live.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submitReview}>
          <input
            className="w-full rounded-2xl border border-[var(--stroke)] bg-transparent px-4 py-3 text-sm"
            placeholder="Teacher name"
            value={teacherName}
            onChange={(event) => setTeacherName(event.target.value)}
            required
          />
          <input
            className="w-full rounded-2xl border border-[var(--stroke)] bg-transparent px-4 py-3 text-sm"
            placeholder="Subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="w-full rounded-2xl border border-[var(--stroke)] bg-transparent px-4 py-3 text-sm"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              required
            >
              {ratingLabels.map((label) => (
                <option key={label} value={label}>
                  Rating: {label}
                </option>
              ))}
            </select>
            <input
              className="w-full rounded-2xl border border-[var(--stroke)] bg-transparent px-4 py-3 text-sm"
              placeholder="Nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
            />
          </div>
          <textarea
            className="min-h-[140px] w-full rounded-2xl border border-[var(--stroke)] bg-transparent px-4 py-3 text-sm"
            placeholder="Optional review text"
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          {notice ? (
            <p className="text-sm text-[var(--muted)]">{notice}</p>
          ) : null}
        </form>
      </aside>
    </div>
  );
}
