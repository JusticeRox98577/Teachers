import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";

const allowedSchools = [
  "Skyline High School",
  "Issaquah High School",
  "Liberty High School",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const school = searchParams.get("school");

  if (!school || !allowedSchools.includes(school)) {
    return NextResponse.json(
      { error: "Invalid school." },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("reviews")
    .select(
      "id, school, teacher_name, subject, rating, nickname, review_text, created_at"
    )
    .eq("school", school)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json(
      { error: "Failed to load reviews." },
      { status: 500 }
    );
  }

  return NextResponse.json({ reviews: data ?? [] });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    school?: string;
    teacher_name?: string;
    subject?: string;
    rating?: number;
    nickname?: string;
    review_text?: string;
  };

  if (!payload.school || !allowedSchools.includes(payload.school)) {
    return NextResponse.json(
      { error: "Please choose a valid school." },
      { status: 400 }
    );
  }

  const teacherName = payload.teacher_name?.trim();
  const subject = payload.subject?.trim();
  const nickname = payload.nickname?.trim();
  const reviewText = payload.review_text?.trim() ?? null;
  const rating = Number(payload.rating);

  if (!teacherName || !subject || !nickname || !Number.isFinite(rating)) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5." },
      { status: 400 }
    );
  }

  if (nickname.length > 32 || teacherName.length > 80 || subject.length > 60) {
    return NextResponse.json(
      { error: "One or more fields are too long." },
      { status: 400 }
    );
  }

  if (reviewText && reviewText.length > 800) {
    return NextResponse.json(
      { error: "Review text is too long." },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("reviews").insert({
    school: payload.school,
    teacher_name: teacherName,
    subject,
    rating,
    nickname,
    review_text: reviewText,
    user_id: user?.id ?? null,
    is_approved: false,
    is_rejected: false,
  });

  if (error) {
    return NextResponse.json(
      { error: "Unable to submit review." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
