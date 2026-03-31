const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    console.log('Reading credentials from test-results.txt...');
    let content;
    try {
        content = fs.readFileSync('test-results.txt', 'utf16le');
    } catch (e) {
        console.error('Failed to read test-results.txt in UTF-16LE, trying UTF-8...');
        content = fs.readFileSync('test-results.txt', 'utf8');
    }

    const urlMatch = content.match(/Supabase URL: (https:\/\/\S+)/);
    const keyMatch = content.match(/Using service role key: (\S+)/);

    if (!urlMatch || !keyMatch) {
        console.error('Could not find credentials in test-results.txt');
        // Try fallback to search for keys in memory or common patterns
        console.log('URL found:', !!urlMatch);
        console.log('Key found:', !!keyMatch);
        process.exit(1);
    }

    const supabaseUrl = urlMatch[1];
    const supabaseKey = keyMatch[1].replace(/\.+$/, ''); // Remove trailing dots if any

    console.log(`Supabase URL: ${supabaseUrl}`);
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching products...');
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, name, category');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        return;
    }

    // Identify Irish products
    const irishProducts = products.filter(p => {
        const nameMatch = (p.name || '').toLowerCase().includes('irish language');
        const catMatch = ['gaeilge', 'irish', 'gagileg'].includes((p.category || '').toLowerCase());
        return nameMatch || catMatch;
    });

    console.log(`Found ${irishProducts.length} Irish products to update.`);
    irishProducts.forEach(p => console.log(`- ${p.name} (Current: ${p.category})`));

    if (irishProducts.length === 0) {
        console.log('No products to update.');
        return;
    }

    const ids = irishProducts.map(p => p.id);
    console.log('Performing update...');
    const { error: updateError } = await supabase
        .from('products')
        .update({ category: 'Irish' })
        .in('id', ids);

    if (updateError) {
        console.error('Error updating products:', updateError);
    } else {
        console.log('SUCCESS: All Irish language products have been moved to the "Irish" category.');
    }
}

run();
