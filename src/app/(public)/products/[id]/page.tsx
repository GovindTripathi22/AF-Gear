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
    const product = await productService.getProductById(id);

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
