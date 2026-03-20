import { productService } from "@/services/productService";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

export default async function ProductPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { id } = await params;
    const { type } = await searchParams;
    // Check if the id is a typical UUID structure
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let product;
    if (isUuid) {
        product = await productService.getProductById(id);
    } else {
        // If it's not a UUID, it's likely a slug from mock data or manual URL entry
        product = await productService.getProductBySlug(id);
        
        // Fallback for mock data where 'id' is a simple string like '1', '2'
        if (!product && !isNaN(Number(id))) {
             product = await productService.getProductById(id);
        }
    }

    if (!product) {
        notFound();
    }

    // Fetch Reviews
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    let reviews: any[] = [];

    if (supabase) {
        try {
            const { data } = await supabase
                .from("reviews")
                .select("*")
                .eq("product_id", id)
                .order("created_at", { ascending: false });
            if (data) reviews = data;
        } catch (e) {
            console.error("Error fetching reviews", e);
        }
    }

    const mappedProduct = {
        ...product,
        title: product.name,
        image: product.images?.[0] || '',
        defaultKids: type === 'kids',
    };

    return <ProductClient product={mappedProduct} initialReviews={reviews || []} />;
}
