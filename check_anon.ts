import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing SUPABASE env vars.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('\n\n--- Fetching products as ANONYMOUS user ---');
    const { data, error } = await supabase.from('products').select('*').eq('visibility', 'published').order('created_at', { ascending: false });
    if (error) console.error('Error fetching products:', error);
    else console.log('Products found:', data.length);
}

run();
