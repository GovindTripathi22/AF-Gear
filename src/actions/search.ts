"use server";

import { createClient } from '@/utils/supabase/server';
import type { Product } from '@/types';

export async function searchProducts(query: string): Promise<Product[]> {
    if (!query) return [];

    const supabase = await createClient();

    // Sanitize query to prevent PostgREST filter injection
    const sanitized = query.replace(/[%_\\(),."']/g, '');
    if (!sanitized) return [];

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('visibility', 'published')
        .or(`name.ilike.%${sanitized}%,category.ilike.%${sanitized}%`)
        .limit(5);

    if (error) {
        console.error('Search error:', error);
        return [];
    }

    return data as Product[];
}
