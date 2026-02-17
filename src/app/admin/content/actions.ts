'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateContent(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const section = formData.get('section') as string
    const content = JSON.parse(formData.get('content') as string)

    const { error } = await supabase
        .from('site_content')
        .upsert({ key: section, content, updated_by: user.id, updated_at: new Date().toISOString() })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/content')
    revalidatePath('/', 'layout') // Revalidate whole site as content might be global
    return { success: true }
}
