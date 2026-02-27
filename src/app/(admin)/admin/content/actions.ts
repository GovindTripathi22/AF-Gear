'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateContent(prevState: unknown, formData: FormData) {
    const supabase = createAdminClient()

    const section = formData.get('section') as string
    const content = JSON.parse(formData.get('content') as string)

    const { error } = await supabase
        .from('site_content')
        .upsert({ key: section, content })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/content')
    revalidatePath('/', 'layout')
    return { success: true }
}
