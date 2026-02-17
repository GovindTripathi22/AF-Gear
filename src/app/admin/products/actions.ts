'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Helper to slugify
function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export async function deleteProduct(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/products')
}

export async function upsertProduct(prevState: unknown, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const id = formData.get('id') as string | null
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const status = formData.get('status') as string
    const stock = formData.get('stock') as string
    const visibility = formData.get('visibility') as string
    const category = formData.get('category') as string
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()) || []

    // Images are handled via client-side upload usually for better UX, 
    // but here we just accept a comma-separated list of URLs from a hidden field
    // populated by the client-side uploader.
    const images = (formData.get('image_urls') as string)?.split(',').filter(Boolean) || []

    const slug = formData.get('slug') as string || slugify(name)

    const productData = {
        name,
        slug,
        description,
        price,
        status,
        stock,
        visibility,
        category,
        tags,
        images,
        updated_at: new Date().toISOString(),
    }

    let error: { message: string } | null;

    if (id) {
        // Update
        const { error: updateError } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
        error = updateError
    } else {
        // Create
        const { error: insertError } = await supabase
            .from('products')
            .insert(productData)
        error = insertError
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}
