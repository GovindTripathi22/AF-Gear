<<<<<<< HEAD
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
=======
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
>>>>>>> target/main

/**
 * Server-only Supabase admin client using the SERVICE_ROLE_KEY.
 * This bypasses Row Level Security (RLS) policies.
<<<<<<< HEAD
 * ONLY use this for admin/server operations (insert, update, delete).
 * NEVER expose this client or its key to the browser.
 */
export function createAdminClient() {
    if (typeof window !== 'undefined') {
        throw new Error(
            'createAdminClient must only be used in server-side code. ' +
            'Do not import this in client components.'
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables. ' +
            'The admin client cannot function without these.'
        );
=======
 * ONLY use this for admin CMS operations (insert, update, delete).
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return null as any;
>>>>>>> target/main
    }

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
<<<<<<< HEAD
    });
=======
    })
>>>>>>> target/main
}
