import type { Product } from '@/types/product';

export interface ProductCMSView {
    id: string;
    display_title: string;
    category: string;
    price_label: string;
    price_raw: number;
    health_status: 'ok' | 'alert' | 'warning';
    health_label: string;
    is_live: boolean;
    preview_img: string;
}

export function mapProductToCMSView(product: Product): ProductCMSView {
    // Determine stock health for neon badges
    let health_status: 'ok' | 'alert' | 'warning' = 'ok';
    let health_label = 'In Stock';

    if (product.stock_status === 'out_of_stock') {
        health_status = 'alert';
        health_label = 'Out of Stock';
    } else if (product.stock_status === 'limited') {
        health_status = 'warning';
        health_label = 'Limited';
    } else if (product.product_status === 'coming_soon') {
        health_status = 'warning';
        health_label = 'Coming Soon';
    } else if (product.product_status === 'booking_only') {
        health_status = 'ok';
        health_label = 'Booking Only';
    }

    return {
        id: product.id,
        display_title: product.name,
        category: product.category || 'Uncategorized',
        price_label: `€${(product.price || 0).toFixed(2)}`,
        price_raw: product.price || 0,
        health_status,
        health_label,
        is_live: product.visibility === 'published',
        preview_img: product.images?.[0] || '/assets/placeholder.png'
    };
}
