const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
    let env = {};
    try {
        const envStr = fs.readFileSync('.env.local', 'utf-8');
        envStr.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    env[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
    } catch (e) {
        process.exit(1);
    }

    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        process.exit(1);
    }

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('--- DUPLICATE CHECK (LIMERICK) ---');
    const { data: limerick, error: lError } = await supabase
        .from('products')
        .select('id, name, category, image')
        .eq('category', 'Limerick');
    
    if (lError) console.error(lError);
    else console.log(JSON.stringify(limerick, null, 2));

    console.log('\n--- IRISH LANGUAGE CHECK (CLUB) ---');
    const { data: club, error: cError } = await supabase
        .from('products')
        .select('id, name, category')
        .eq('category', 'Club');

    if (cError) console.error(cError);
    else console.log(JSON.stringify(club, null, 2));
    
    console.log('\n--- ALL CATEGORIES ---');
    const { data: cats, error: catError } = await supabase
        .from('products')
        .select('category');
    
    if (catError) console.error(catError);
    else {
        const uniqueCats = [...new Set(cats.map(c => c.category))];
        console.log('Categories found:', uniqueCats);
    }
}

check();
