import { createClient } from '@/utils/supabase/server';
<<<<<<< HEAD
import { createStaticClient } from '@/utils/supabase/static';
import type { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
    // ... same mock products
];

export const productService = {
    async getProducts(): Promise<Product[]> {
        try {
            // Use static client for public listing to support ISR
            const supabase = createStaticClient();
            if (!supabase) return MOCK_PRODUCTS;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('visibility', 'published')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                return MOCK_PRODUCTS;
            }

            return data as Product[];
        } catch (err) {
            console.error('Error in getProducts:', err);
            return MOCK_PRODUCTS;
        }
    },

    async getProductBySlug(slug: string): Promise<Product | null> {
        try {
            const supabase = createStaticClient();
            if (!supabase) return MOCK_PRODUCTS.find(p => p.slug === slug) || null;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !data) {
                return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
            }

            return data as Product;
        } catch (err) {
            return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
        }
    },

    async getProductById(id: string): Promise<Product | null> {
        try {
            const supabase = createStaticClient();
            if (!supabase) return MOCK_PRODUCTS.find(p => p.id === id) || null;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                return MOCK_PRODUCTS.find(p => p.id === id) || null;
            }

            return data as Product;
        } catch (err) {
            return MOCK_PRODUCTS.find(p => p.id === id) || null;
        }
    },

    async getAllProductsAdmin(): Promise<Product[]> {
        try {
            // Admin operations still use the authenticated server client
            const supabase = await createClient();
            if (!supabase) return MOCK_PRODUCTS;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                return MOCK_PRODUCTS;
            }

            return data as Product[];
        } catch (err) {
            return MOCK_PRODUCTS;
        }
=======
import type { Product } from '@/types';

export const productService = {
    async getProducts(): Promise<Product[]> {
        const supabase = await createClient();
        if (!supabase) return [];
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
        if (!supabase) return null;
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
        if (!supabase) return null;
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
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all products (admin):', error);
            return [];
        }

        return data as Product[];
>>>>>>> target/main
    }
}
