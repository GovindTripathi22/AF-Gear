import { productService } from "@/services/productService";
import CollectionClient from "./CollectionClient";

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // Next.js 15+ wait for params
    const { slug } = await params;

    // Fetch all published products from Supabase
    const products = await productService.getProducts();

    return <CollectionClient slug={slug} products={products} />;
}
