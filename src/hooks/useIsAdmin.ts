// src/hooks/useIsAdmin.ts
"use client";

import { useUser } from "@clerk/nextjs";

// Client-side admin check using email matching
// The actual gate is server-side in the admin layout
// This is only for UI visibility (showing/hiding admin link)
const ADMIN_EMAILS = [
  "govindtriapthi3@gmail.com",
  "afgearie@yahoo.com",
  "swrj003@gmail.com",
];

export function useIsAdmin(): boolean {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return false;

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email) return false;

  return ADMIN_EMAILS.includes(email);
}
