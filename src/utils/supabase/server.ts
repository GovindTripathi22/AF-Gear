import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth } from '@clerk/nextjs/server'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.");
    }

    // Try to retrieve Clerk token if available
    let clerkToken: string | null = null
    try {
        const authData = await auth();
        if (authData && typeof authData.getToken === 'function') {
            clerkToken = await authData.getToken({ template: 'supabase' })
        }
    } catch (e) {
        // auth() might fail if not in a request context (like during build time/static generation)
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
            ...(clerkToken ? {
                accessToken: async () => clerkToken,
                global: {
                    headers: {
                        Authorization: `Bearer ${clerkToken}`,
                    },
                },
            } : {}),
        }
    )
}
