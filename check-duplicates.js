const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
    const envStr = fs.readFileSync('.env.local', 'utf-8');
    const env = Object.fromEntries(
        envStr.split('\n')
            .filter(l => l.trim() && !l.startsWith('#'))
            .map(l => {
                const [key, ...rest] = l.split('=');
                return [key.trim(), rest.join('=').trim()];
            })
    );

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('--- Limerick Duplicates ---');
    const { data: limerick, error: lError } = await supabase
        .from('products')
        .select('id, name, category, images')
        .eq('category', 'Limerick');
    
    if (lError) console.error(lError);
    else console.log(JSON.stringify(limerick, null, 2));

    console.log('\n--- Irish Language Products ---');
    const { data: irish, error: iError } = await supabase
        .from('products')
        .select('id, name, category')
        .or('name.ilike.%irish language%,category.eq.Irish');

    if (iError) console.error(iError);
    else console.log(JSON.stringify(irish, null, 2));
}

check();
