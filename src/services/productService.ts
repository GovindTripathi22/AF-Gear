import { createClient } from '@/utils/supabase/server';
import { createStaticClient } from '@/utils/supabase/static';
import type { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Pro Performance Jersey",
        description: "Elite level performance jersey with moisture-wicking technology.",
        price: 45.00,
        images: ["https://images.unsplash.com/photo-1581009146145-b5ef03a74010?q=80&w=800"],
        category: "jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pro-performance-jersey",
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        name: "Squad Training Shorts",
        description: "Durable training shorts designed for maximum mobility.",
        price: 25.00,
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800"],
        category: "shorts",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "squad-training-shorts",
        created_at: new Date().toISOString()
    }
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
    }
}
