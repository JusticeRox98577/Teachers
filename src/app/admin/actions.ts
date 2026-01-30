"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail, isGoogleProvider } from "@/lib/auth";

const assertAdmin = async () => {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email) || !isGoogleProvider(user.app_metadata?.provider)) {
    throw new Error("Unauthorized");
  }

  return user;
};

export async function approveReview(formData: FormData) {
  await assertAdmin();
  const reviewId = String(formData.get("reviewId") ?? "");

  if (!reviewId) {
    throw new Error("Missing review id");
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("reviews")
    .update({
      is_approved: true,
      approved_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    throw new Error("Failed to approve review");
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function rejectReview(formData: FormData) {
  await assertAdmin();
  const reviewId = String(formData.get("reviewId") ?? "");

  if (!reviewId) {
    throw new Error("Missing review id");
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("reviews")
    .update({
      is_rejected: true,
      rejected_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    throw new Error("Failed to reject review");
  }

  revalidatePath("/admin");
}
