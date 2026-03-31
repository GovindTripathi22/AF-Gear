const { createAdminClient } = require('./src/utils/supabase/admin.ts');

async function check() {
    const supabase = createAdminClient();

    console.log('--- Limerick Duplicates ---');
    const { data: limerick, error: lError } = await supabase
        .from('products')
        .select('id, name, category, image, sizeChart')
        .eq('category', 'Limerick');
    
    if (lError) console.error(lError);
    else console.log(JSON.stringify(limerick, null, 2));

    console.log('\n--- Club/Irish Category Review ---');
    const { data: club, error: cError } = await supabase
        .from('products')
        .select('id, name, category, sizeChart')
        .eq('category', 'Club');

    if (cError) console.error(cError);
    else console.log(JSON.stringify(club, null, 2));
}

check();
