import { createBrowserClient } from '@supabase/ssr'

export function createClient(clerkToken?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a proxy or handle missing config gracefully
    // Most supabase-js methods will fail if this happens, but it prevents a crash at initialization
    return {} as any;
  }

  const options: any = {}
  if (clerkToken) {
    options.accessToken = async () => clerkToken;
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
