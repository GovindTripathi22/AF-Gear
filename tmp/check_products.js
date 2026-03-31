const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function run() {
    try {
        const content = fs.readFileSync('d:/AF-Gear-main/.env.local', 'utf16le');
        const env = {};
        content.split('\n').filter(l => l.trim() && !l.startsWith('#')).forEach(line => {
            const [key, ...rest] = line.split('=');
            env[key.trim().replace(/^\ufeff/, '')] = rest.join('=').trim();
        });

        const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase
            .from('products')
            .select('id, name, category, slug')
            .or('category.eq.Club,category.eq.Irish,category.eq.Limerick');

        if (error) throw error;

        console.log('--- PRODUCTS ---');
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
