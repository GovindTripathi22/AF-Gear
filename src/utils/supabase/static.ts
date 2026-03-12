import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Static client for ISR/SSG where cookies are not available.
 * Use this only for public data fetching during build or ISR.
 */
export function createStaticClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
