"use server";

import { createClient } from '@/utils/supabase/server';
import type { Product } from '@/types';

export async function searchProducts(query: string): Promise<Product[]> {
    if (!query) return [];

    const supabase = await createClient();

    // Perform an ILIKE search on name or category
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('visibility', 'published')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5);

    if (error) {
        console.error('Search error:', error);
        return [];
    }

    return data as Product[];
}
