// src/utils/safeError.ts
const SAFE_MESSAGES: Record<string, string> = {
  "duplicate key": "This item already exists.",
  "violates foreign key": "Related item not found.",
  "permission denied": "You don't have permission for this action.",
  "JWT expired": "Your session has expired. Please sign in again.",
};

export function safeErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!error) return fallback;

  const msg = error instanceof Error ? error.message : String(error);

  // Check for known safe messages
  for (const [key, safe] of Object.entries(SAFE_MESSAGES)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return safe;
  }

  // Log the real error server-side, return generic to client
  console.error("[Server Error]:", msg);
  return fallback;
}
