import { createClient } from '@/utils/supabase/server';
import type { Product } from '@/types';

export const productService = {
    async getProducts(): Promise<Product[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('visibility', 'published')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        return data as Product[];
    },

    async getProductBySlug(slug: string): Promise<Product | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`Error fetching product ${slug}:`, error);
            return null;
        }

        return data as Product;
    },

    async getProductById(id: string): Promise<Product | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching product ID ${id}:`, error);
            return null;
        }

        return data as Product;
    },

    async getAllProductsAdmin(): Promise<Product[]> {
        const supabase = await createClient(); // Need to ensure admin row-level security or use service key if needed, assuming user is authed as admin
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all products (admin):', error);
            return [];
        }

        return data as Product[];
    }
}
