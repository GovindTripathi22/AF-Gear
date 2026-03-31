// src/lib/admin.ts
// Single source of truth for admin access control

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export function isAdminUser(
  userId?: string | null,
  email?: string | null
): boolean {
  if (!userId && !email) return false;
  if (userId && ADMIN_USER_IDS.includes(userId)) return true;
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return true;
  return false;
}
