import { productService } from "@/services/productService";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

<<<<<<< HEAD
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
=======
export default async function ProductPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { id } = await params;
    const { type } = await searchParams;
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
    const product = await productService.getProductById(id);

    if (!product) {
        notFound();
    }

<<<<<<< HEAD
=======
    // Fetch Reviews
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: reviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });

>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
    const mappedProduct = {
        ...product,
        title: product.name,
        image: product.images?.[0] || '',
<<<<<<< HEAD
    };

    return <ProductClient product={mappedProduct} />;
=======
        defaultKids: type === 'kids',
    };

    return <ProductClient product={mappedProduct} initialReviews={reviews || []} />;
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
}
