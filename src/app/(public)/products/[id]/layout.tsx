import { productService } from "@/services/productService";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await productService.getProductById(id);

    if (!product) {
        return {
            title: "Product Not Found | AF-Gear",
            description: "The requested product does not exist.",
        };
    }

    return {
        title: `${product.name} | AF-Gear`,
        description: `Buy ${product.name} - ${product.category}. Premium teamwear made to last.`,
        openGraph: {
            title: product.name,
            description: `Checkout ${product.name} starting at ${product.price}.`,
            images: [
                {
                    url: product.images?.[0] || '',
                    width: 800,
                    height: 800,
                    alt: product.name,
                }
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: `Checkout ${product.name} starting at ${product.price}.`,
            images: [product.images?.[0] || ''],
        },
    };
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
