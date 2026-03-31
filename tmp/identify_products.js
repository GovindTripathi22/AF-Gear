const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Decode UTF-16LE file
const content = fs.readFileSync('d:/AF-Gear-main/.env.local', 'utf16le');
const env = {};
content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim().replace(/^\ufeff/, '');
        const val = parts.slice(1).join('=').trim();
        env[key] = val;
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, category, slug, images');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log('--- ALL PRODUCTS ---');
    console.log(JSON.stringify(products, null, 2));

    console.log('\n--- LIMERICK DUPLICATES ---');
    const limerick = products.filter(p => p.category === 'Limerick');
    const seen = new Set();
    const dups = [];
    limerick.forEach(p => {
        if (seen.has(p.name)) dups.push(p);
        else seen.add(p.name);
    });
    console.log(JSON.stringify(dups, null, 2));

    console.log('\n--- IRISH LANGUAGE PRODUCTS ---');
    const irish = products.filter(p => 
        (p.name || '').toLowerCase().includes('irish language') || 
        (p.name || '').toLowerCase().includes('gaeilge') ||
        (p.category || '').toLowerCase() === 'irish'
    );
    console.log(JSON.stringify(irish, null, 2));

    process.exit(0);
}

check().catch(err => {
    console.error(err);
    process.exit(1);
});
