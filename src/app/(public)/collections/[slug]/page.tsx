import { productService } from "@/services/productService";
import { createStaticClient } from "@/utils/supabase/static";
import { fetchCategories } from "@/services/categoryService";
import CollectionClient from "./CollectionClient";

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const supabase = createStaticClient();
    const [products, categories] = await Promise.all([
        productService.getProducts(),
        fetchCategories(supabase),
    ]);

    return <CollectionClient slug={slug} products={products} categories={categories} />;
}
