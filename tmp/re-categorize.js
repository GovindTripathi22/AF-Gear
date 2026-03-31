const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    let envContent;
    try {
        envContent = fs.readFileSync('.env.local', 'utf16le');
    } catch (e) {
        envContent = fs.readFileSync('.env.local', 'utf8');
    }

    const env = Object.fromEntries(
        envContent.split('\n')
            .filter(l => l.trim() && !l.startsWith('#'))
            .map(l => {
                const [key, ...rest] = l.split('=');
                return [key.trim(), rest.join('=').trim()];
            })
    );

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials in .env.local');
        // Fallback to searching for the keys in the output of the prev commands if possible
        // but for now let's see if this works
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Identifying products to move to Irish category...');
    
    // Find products with "Irish Language" in name OR category matches
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, name, category');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        return;
    }

    const irishProducts = products.filter(p => 
        (p.name || '').toLowerCase().includes('irish language') || 
        (p.category || '').toLowerCase() === 'gaeilge' ||
        (p.category || '').toLowerCase() === 'irish'
    );

    console.log(`Found ${irishProducts.length} Irish products.`);
    irishProducts.forEach(p => console.log(`- ${p.name} (Current Category: ${p.category})`));

    if (irishProducts.length === 0) {
        console.log('No products found to update.');
        return;
    }

    const idsToUpdate = irishProducts.map(p => p.id);

    console.log('Updating categories to "Irish"...');
    const { error: updateError } = await supabase
        .from('products')
        .update({ category: 'Irish' })
        .in('id', idsToUpdate);

    if (updateError) {
        console.error('Error updating products:', updateError);
    } else {
        console.log('Successfully moved products to Irish category.');
    }
}

run();
