import { createClient } from '@/utils/supabase/server';
import { createStaticClient } from '@/utils/supabase/static';
import type { Product } from '@/types';
import { normalizeProductToken } from '@/utils/productUtils';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Pro Performance Club Jersey",
        description: "Elite level performance jersey with moisture-wicking technology.",
        price: 45.00,
        images: ["/assets/club-1.png"],
        category: "Club",
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
        images: ["/assets/club-1.png"],
        category: "Club",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "squad-training-shorts",
        created_at: new Date().toISOString()
    },
    {
        id: "irish-1",
        name: "Gaeilge Heritage Jersey",
        description: "Show your heritage with the premium Gaeilge collection.",
        price: 49.99,
        images: ["/assets/irish-1.png"],
        category: "Irish",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "gaeilge-heritage",
        created_at: new Date().toISOString()
    },
    {
        id: "limerick-1",
        name: "Limerick Treaty Edition",
        description: "Premium Limerick selection for the Treaty City.",
        price: 54.99,
        images: ["/assets/limerick-1.png"],
        category: "Limerick",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "limerick-treaty-edition",
        created_at: new Date().toISOString()
    },
    {
        id: "tipperary-1",
        name: "Tipperary Premier Jersey",
        description: "The Premier County's finest selection.",
        price: 54.99,
        images: ["/assets/tipperary-1.png"],
        category: "Tipperary",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "tipperary-premier",
        created_at: new Date().toISOString()
    },
    {
        id: "pj1",
        name: "Custom Pub Jersey - Design A",
        description: "Bespoke social jersey designed for local pubs and communities.",
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
        description: "Bespoke social jersey designed for local pubs and communities.",
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
        description: "Bespoke social jersey designed for local pubs and communities.",
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
        description: "Bespoke social jersey designed for local pubs and communities.",
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

function isVisibleProduct(product: Product): boolean {
    const visibility = String(product.visibility || 'published').toLowerCase();
    return !['draft', 'hidden', 'unpublished', 'archived'].includes(visibility);
}

function findMockProduct(identifier: string): Product | null {
    const token = normalizeProductToken(identifier);
    return MOCK_PRODUCTS.find((p) =>
        normalizeProductToken(p.id) === token ||
        normalizeProductToken(p.slug) === token
    ) || null;
}

export const productService = {
    async getProducts(): Promise<Product[]> {
        try {
            // Use static client for public listing to support ISR
            const supabase = createStaticClient();
            if (!supabase) return MOCK_PRODUCTS;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                return MOCK_PRODUCTS;
            }

            const visibleProducts = (data as Product[]).filter(isVisibleProduct);
            return visibleProducts.length > 0 ? visibleProducts : MOCK_PRODUCTS;
        } catch (err) {
            console.error('Error in getProducts:', err);
            return MOCK_PRODUCTS;
        }
    },

    async getProductBySlug(slug: string): Promise<Product | null> {
        try {
            const supabase = createStaticClient();
            if (!supabase) return findMockProduct(slug);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();

            if (error || !data) {
                return productService.getProductById(slug);
            }

            return data as Product;
        } catch (err) {
            return findMockProduct(slug);
        }
    },

    async getProductById(id: string): Promise<Product | null> {
        try {
            const supabase = createStaticClient();
            if (!supabase) return findMockProduct(id);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (error || !data) {
                return findMockProduct(id);
            }

            return data as Product;
        } catch (err) {
            return findMockProduct(id);
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
