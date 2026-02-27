import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('\n\n--- Testing product insert ---');
    const { data, error } = await supabase.from('products').insert({
        name: 'Test Product',
        slug: 'test-product-' + Date.now(),
        description: 'Test',
        price: 10,
        category: 'Club',
        product_status: 'available',
        stock_status: 'in_stock',
        visibility: 'published'
    }).select();

    if (error) console.error('Error inserting product:', error);
    else console.log('Successfully inserted product:', data);

    if (data && data.length > 0) {
        console.log('Cleaning up test product...');
        await supabase.from('products').delete().eq('id', data[0].id);
    }
}

run();
