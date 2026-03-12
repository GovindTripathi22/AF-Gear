import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Manually parse .env.local
const envContent = readFileSync('.env.local', 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        envVars[key.trim()] = valueParts.join('=').trim()
    }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars. Found:', Object.keys(envVars))
    process.exit(1)
}

console.log('Supabase URL:', supabaseUrl)
console.log('Using service role key:', serviceRoleKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function test() {
    // Test 1: Write access
    console.log('\n--- Test 1: INSERT product ---')
    const testName = `_test_product_${Date.now()}`
    const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert({
            name: testName,
            slug: testName,
            description: 'Test product - safe to delete',
            price: 9.99,
            status: 'available',
            stock: 'in_stock',
            visibility: 'draft',
            category: 'Club',
            images: [],
            tags: [],
        })
        .select()
        .single()

    if (insertError) {
        console.error('❌ INSERT FAILED:', insertError.message)
        console.error('   Details:', JSON.stringify(insertError))
    } else {
        console.log('✅ INSERT SUCCESS! Product ID:', insertData.id)

        // Test 2: Update
        console.log('\n--- Test 2: UPDATE product ---')
        const { error: updateError } = await supabase
            .from('products')
            .update({ name: testName + '-updated', price: 19.99 })
            .eq('id', insertData.id)

        if (updateError) {
            console.error('❌ UPDATE FAILED:', updateError.message)
        } else {
            console.log('✅ UPDATE SUCCESS!')
        }

        // Test 3: Delete
        console.log('\n--- Test 3: DELETE product ---')
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', insertData.id)

        if (deleteError) {
            console.error('❌ DELETE FAILED:', deleteError.message)
        } else {
            console.log('✅ DELETE SUCCESS!')
        }
    }

    // Test 4: Read all products
    console.log('\n--- Test 4: READ all products ---')
    const { data: products, error: readError } = await supabase
        .from('products')
        .select('id, name, status, stock, visibility')

    if (readError) {
        console.error('❌ READ FAILED:', readError.message)
    } else {
        console.log(`✅ Found ${products?.length || 0} products:`)
        products?.forEach(p => {
            console.log(`   - ${p.name} (status: ${p.status}, stock: ${p.stock}, vis: ${p.visibility})`)
        })
    }

    // Test 5: Check new columns
    console.log('\n--- Test 5: Check new columns ---')
    const { data: colTest, error: colError } = await supabase
        .from('products')
        .select('stock_quantity, compare_price, sku, featured, weight')
        .limit(1)

    if (colError) {
        console.log('⚠️  New columns missing:', colError.message)
        console.log('   Run this SQL in Supabase SQL Editor:')
        console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0;')
        console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price numeric;')
        console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS sku text;')
        console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;')
        console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS weight numeric;')
    } else {
        console.log('✅ All new columns exist!')
    }

    console.log('\n=== ALL TESTS COMPLETE ===')
}

test().catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
})
