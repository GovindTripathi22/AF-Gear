'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { DEFAULT_CATEGORIES, type Category } from '@/services/categoryService'

const CONTENT_KEY = 'store_categories'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getSupabase() {
    const supabase = createAdminClient()
    if (!supabase) throw new Error('Database unavailable')
    return supabase
}

async function readCategories(supabase: any): Promise<Category[]> {
    const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', CONTENT_KEY)
        .single()
    if (!data?.content) return DEFAULT_CATEGORIES
    const arr = Array.isArray(data.content) ? data.content : []
    return arr.length > 0 ? arr : DEFAULT_CATEGORIES
}

async function writeCategories(supabase: any, categories: Category[]) {
    const { error } = await supabase
        .from('site_content')
        .upsert(
            {
                key: CONTENT_KEY,
                section_name: 'store_categories',
                content: categories,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
        )
    if (error) throw new Error(error.message)
}

// ─── Public Actions ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    try {
        const supabase = await getSupabase()
        return await readCategories(supabase)
    } catch {
        return DEFAULT_CATEGORIES
    }
}

export async function saveCategory(formData: FormData) {
    try {
        const supabase = await getSupabase()
        const existing = await readCategories(supabase)

        const id   = (formData.get('id')   as string | null)?.trim() || ''
        const name = (formData.get('name') as string).trim()
        const slug = (formData.get('slug') as string).trim()
            || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        const tagline  = (formData.get('tagline')  as string | null)?.trim() || ''
        const subtitle = (formData.get('subtitle') as string | null)?.trim() || ''
        const crest    = (formData.get('crest')    as string | null)?.trim() || ''
        const image    = (formData.get('image')    as string | null)?.trim() || ''
        const accent   = (formData.get('accent')   as string | null)?.trim() || ''
        const order    = parseInt((formData.get('order') as string) || '99', 10)

        const category: Category = { id: id || slug, name, slug, tagline, subtitle, crest, image, accent, order }

        const idx = existing.findIndex(c => c.id === id)
        let updated: Category[]
        if (idx >= 0) {
            updated = existing.map((c, i) => i === idx ? category : c)
        } else {
            updated = [...existing, category]
        }

        await writeCategories(supabase, updated)
        revalidatePath('/admin/categories')
        revalidatePath('/')
        revalidatePath('/collections/[slug]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteCategory(id: string) {
    try {
        const supabase = await getSupabase()
        const existing = await readCategories(supabase)
        const updated = existing.filter(c => c.id !== id)
        await writeCategories(supabase, updated)
        revalidatePath('/admin/categories')
        revalidatePath('/')
        revalidatePath('/collections/[slug]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function reorderCategories(ordered: string[]) {
    try {
        const supabase = await getSupabase()
        const existing = await readCategories(supabase)
        const updated = ordered
            .map((id, idx) => {
                const cat = existing.find(c => c.id === id)
                return cat ? { ...cat, order: idx + 1 } : null
            })
            .filter(Boolean) as Category[]
        await writeCategories(supabase, updated)
        revalidatePath('/admin/categories')
        revalidatePath('/')
        revalidatePath('/collections/[slug]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
