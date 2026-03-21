import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateClubProducts() {
  console.log('Fetching products containing "Club"...');
  
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name, description')
    .ilike('name', '%Club%');

  if (fetchError) {
    console.error('Error fetching products:', fetchError.message);
    return;
  }

  if (!products || products.length === 0) {
    console.log('No "Club" products found in the database. You may need to add them first or update their names.');
    return;
  }

  console.log(`Found ${products.length} products to update:`, products.map(p => p.name).join(', '));

  let updateCount = 0;

  for (const product of products) {
    // Remove minimum order text if it existed, and append the new description
    const cleanDescription = (product.description || '').replace(/minimum order.*10/gi, '').trim();
    
    // Check if it already has the text to avoid duplication
    if (cleanDescription.includes('customised to your club colours')) {
        console.log(`SKIPPING: ${product.name} (Already updated)`);
        continue;
    }

    const newDescription = `${cleanDescription}

Can be customised to your club colours and club crest can be added also. No minimum order quantity required.`.trim();

    const { error: updateError } = await supabase
      .from('products')
      .update({ description: newDescription })
      .eq('id', product.id);

    if (updateError) {
      console.error(`Error updating ${product.name}:`, updateError.message);
    } else {
      console.log(`SUCCESS: Updated ${product.name}`);
      updateCount++;
    }
  }

  console.log(`\nFinished. Successfully updated ${updateCount} products.`);
}

updateClubProducts();
