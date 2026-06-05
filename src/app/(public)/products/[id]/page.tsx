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
    const product = await productService.getProductBySlug(id);

    if (!product) {
        notFound();
    }

    // Fetch Reviews
    let reviews: any[] = [];
    try {
        const { createClient } = await import("@/utils/supabase/server");
        const supabase = await createClient();
        if (supabase) {
            const { data } = await supabase
                .from("reviews")
                .select("*")
                .eq("product_id", product.id)
                .order("created_at", { ascending: false });
            if (data) reviews = data;
        }
    } catch (e) {
        console.warn("Could not fetch reviews (likely missing Supabase configuration):", e instanceof Error ? e.message : e);
    }

    const mappedProduct = {
        ...product,
        title: product.name,
        image: product.images?.[0] || '',
        defaultKids: type === 'kids',
    };

    return <ProductClient product={mappedProduct} initialReviews={reviews || []} />;
}
