'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

function sanitizeText(input: string): string {
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .trim();
}

export type ProductActionState = {
    error?: string;
    success?: boolean;
} | null;

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function revalidateAll() {
    revalidatePath('/admin/products')
    revalidatePath('/admin')
    revalidatePath('/products', 'layout')
    revalidatePath('/products/[id]', 'page')
    revalidatePath('/collections/[slug]', 'page')
    revalidatePath('/', 'layout')
}

export async function deleteProduct(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidateAll()
}

export async function upsertProduct(prevState: unknown, formData: FormData): Promise<ProductActionState> {
    const supabase = createAdminClient()

    const id = formData.get('id') as string | null
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const productStatus = formData.get('product_status') as string || 'available'
    const stockStatus = formData.get('stock_status') as string || 'in_stock'
    const visibility = formData.get('visibility') as string || 'draft'
    const category = formData.get('category') as string

    // Validation
    if (!name || name.trim().length < 3) {
        return { error: 'Product name must be at least 3 characters long.' }
    }
    if (price < 0) {
        return { error: 'Price cannot be negative.' }
    }
    if (!category) {
        return { error: 'Category is required.' }
    }

    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
    const images = (formData.get('image_urls') as string)?.split(',').filter(Boolean) || []
    const slug = formData.get('slug') as string || slugify(name)

    // Use actual DB column names: product_status, stock_status
    const productData: Record<string, unknown> = {
        name: sanitizeText(name),
        slug,
        description: sanitizeText(description),
        price,
        product_status: productStatus,
        stock_status: stockStatus,
        visibility,
        category: sanitizeText(category),
        tags: tags.map(sanitizeText),
        images,
    }

    let error: { message: string } | null = null;

    if (id) {
        const { error: updateError } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
        error = updateError
    } else {
        const { error: insertError } = await supabase
            .from('products')
            .insert(productData)
        error = insertError
    }

    if (error) {
        console.error("UPSERT FAILED:", error.message);
        return { error: error.message }
    }

    revalidateAll()

    return { success: true }
}

export async function uploadProductImage(formData: FormData) {
    const supabase = createAdminClient();
    if (!supabase) return { error: "No Database Connection" };

    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    try {
        // Ensure bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some((b: { name: string }) => b.name === 'product-images');

        if (!bucketExists) {
            await supabase.storage.createBucket('product-images', {
                public: true,
                allowedMimeTypes: ['image/*'],
            });
        }

        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { error: uploadError.message };
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);

        return { success: true, url: data.publicUrl };
    } catch (err: unknown) {
        console.error("Upload Exception:", err);
        return { error: err instanceof Error ? err.message : "Unknown error during upload" };
    }
}
