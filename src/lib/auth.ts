const adminEmails = new Set(
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export const isAdminEmail = (email?: string | null) => {
  if (!email) {
    return false;
  }
  return adminEmails.has(email.toLowerCase());
};

export const isGoogleProvider = (provider?: string | null) =>
  provider?.toLowerCase() === "google";
