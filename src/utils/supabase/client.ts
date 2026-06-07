import { createBrowserClient } from '@supabase/ssr'

export function createClient(clerkToken?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.");
  }

  const options: any = {}
  if (clerkToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    }
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    options
  )
}
