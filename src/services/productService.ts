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
    },
    {
        id: "pj1",
        name: "Custom Pub Jersey - Design A",
        description: "Bespoke social jersey designed for local pubs and communities. Premium quality and comfort.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000037870.jpg"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-a",
        created_at: new Date().toISOString()
    },
    {
        id: "pj2",
        name: "Custom Pub Jersey - Design B",
        description: "Bespoke social jersey designed for local pubs and communities. Premium quality and comfort.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000037872.jpg"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-b",
        created_at: new Date().toISOString()
    },
    {
        id: "pj3",
        name: "Custom Pub Jersey - Design C",
        description: "Bespoke social jersey designed for local pubs and communities. Premium quality and comfort.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000037874.jpg"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-c",
        created_at: new Date().toISOString()
    },
    {
        id: "pj4",
        name: "Custom Pub Jersey - Design D",
        description: "Bespoke social jersey designed for local pubs and communities. Premium quality and comfort.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000038099.png"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-d",
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
