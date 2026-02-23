import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('\n\n--- Fetching products ---');
    const { data, error } = await supabase.from('products').select('*').limit(2);
    if (error) console.error('Error fetching products:', error);
    else console.log('Products:', data.length);

    console.log('\n\n--- Checking storage buckets ---');
    const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
    if (bucketsErr) console.error('Error listing buckets:', bucketsErr);
    else {
        const bucketNames = buckets.map(b => b.name);
        console.log('Buckets:', bucketNames);

        if (!bucketNames.includes('product-images')) {
            console.log('Creating product-images bucket...');
            const { error: createErr } = await supabase.storage.createBucket('product-images', { public: true });
            if (createErr) console.error('Failed to create bucket:', createErr);
            else console.log('Successfully created product-images bucket.');
        } else {
            console.log('product-images bucket already exists.');
        }
    }
}

run();
