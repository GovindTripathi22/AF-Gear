import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

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

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function verify() {
    console.log('Checking products table...')
    const { data: pData, error: pError } = await supabase
        .from('products')
        .select('price_cents, currency')
        .limit(1)
    
    if (pError) {
        console.error('❌ Products table missing columns:', pError.message)
    } else {
        console.log('✅ Products table has price_cents and currency.')
    }

    console.log('Checking orders table...')
    const { data: oData, error: oError } = await supabase
        .from('orders')
        .select('paid_at')
        .limit(1)

    if (oError) {
        console.error('❌ Orders table missing columns:', oError.message)
    } else {
        console.log('✅ Orders table has paid_at.')
    }
}

verify()
