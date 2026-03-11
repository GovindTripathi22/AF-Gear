import { createClient } from '@/utils/supabase/server';
import type { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Limerick Pro Jersey',
        slug: 'limerick-pro-jersey',
        description: 'Elite performance jersey with moisture-wicking technology.',
        price: 55,
        product_status: 'available',
        stock_status: 'in_stock',
        category: 'Limerick',
        images: ['/assets/limerick-1.png', '/assets/limerick-2.png'],
        visibility: 'published',
        created_at: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Tipperary Training Top',
        slug: 'tipperary-training-top',
        description: 'Lightweight training top designed for maximum mobility.',
        price: 45,
        product_status: 'available',
        stock_status: 'in_stock',
        category: 'Tipperary',
        images: ['/assets/tipperary-1.png', '/assets/tipperary-2.png'],
        visibility: 'published',
        created_at: new Date().toISOString()
    },
    {
        id: '3',
        name: 'AF Classic Hoodie',
        slug: 'af-classic-hoodie',
        description: 'Premium heavyweight cotton hoodie for comfort and style.',
        price: 65,
        product_status: 'available',
        stock_status: 'in_stock',
        category: 'Club',
        images: ['/assets/hero-jacket.png', '/assets/club-1.png'],
        visibility: 'published',
        created_at: new Date().toISOString()
    }
];

export const productService = {
    async getProducts(): Promise<Product[]> {
        try {
            const supabase = await createClient();
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
            const supabase = await createClient();
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
            const supabase = await createClient();
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
