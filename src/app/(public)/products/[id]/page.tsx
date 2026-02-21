import { productService } from "@/services/productService";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await productService.getProductById(id);

    if (!product) {
        notFound();
    }

    const mappedProduct = {
        ...product,
        title: product.name,
        image: product.images?.[0] || '',
    };

    return <ProductClient product={mappedProduct} />;
}
