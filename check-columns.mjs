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

const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'], {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function check() {
    const { data, error } = await supabase.from('products').select('*').limit(1).single()
    if (error) { console.log('Error:', error.message); return }

    const keys = Object.keys(data)
    keys.forEach(k => console.log(`${k}: ${JSON.stringify(data[k])}`))
}

check()
