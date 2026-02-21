export type ProductStatus = 'available' | 'booking_only' | 'unavailable' | 'coming_soon';
export type StockStatus = 'in_stock' | 'out_of_stock' | 'limited';
export type VisibilityStatus = 'published' | 'draft' | 'hidden';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    product_status: ProductStatus;
    stock_status: StockStatus;
    category: string;
    images: string[];
    tags?: string[];
    featured?: boolean;
    visibility: VisibilityStatus;
    created_at: string;
    updated_at?: string;
}
