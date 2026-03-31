// src/utils/serverRateLimit.ts
import { headers } from "next/headers";

const attempts = new Map<string, { count: number; resetAt: number }>();

// Cleanup every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of attempts) {
    if (now > val.resetAt) attempts.delete(key);
  }
}, 600_000);

export async function checkServerActionRate(
  actionName: string,
  limit = 5,
  windowMs = 60_000
): Promise<{ blocked: boolean }> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${actionName}:${ip}`;
  const now = Date.now();

  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { blocked: false };
  }

  entry.count += 1;
  return { blocked: entry.count > limit };
}
