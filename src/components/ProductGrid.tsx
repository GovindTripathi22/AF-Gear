"use client";

import { ProductCard } from "./ProductCard";
import { CollectionHeader } from "./Collections/CollectionHeader";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ProductModal } from "./ProductModal";

interface ProductGridProps {
    filter: string;
    products: any[];
}

interface SelectedProduct {
    id: number;
    title: string;
    price: string;
    image?: string;
    category: string;
    description: string;
    status: string;
    stock: string;
    images?: string[];
}

export function ProductGrid({ filter, products = [] }: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

    // Group products by category
    const collections = products.reduce((acc, product) => {
        const category = product.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = {
                title: category,
                subtitle: `Premium ${category} Collection`,
                products: []
            };
        }
        acc[category].products.push({
            id: product.id,
            title: product.name,
            price: product.price ? `€${product.price}` : 'Contact for Price',
            image: product.images?.[0] || '/placeholder.png',
            category: product.category,
            description: product.description,
            status: product.status,
            stock: product.stock,
            images: product.images
        });
        return acc;
    }, {} as Record<string, any>);


    const collectionsToShow = filter === "All"
        ? Object.entries(collections)
        : Object.entries(collections).filter(([key]) => key === filter);

    return (
        <>
            <div className="w-full max-w-[1920px] mx-auto pb-32 overflow-hidden">
                {collectionsToShow.map(([key, collection]: [string, any]) => (
                    <section key={key} id={key.toLowerCase()} className="mb-24 relative scroll-mt-32">
                        <div className="px-4 md:px-8 max-w-[1600px] mx-auto text-center mb-8">
                            <CollectionHeader
                                title={collection.title}
                                subtitle={collection.subtitle}
                                crestImage={
                                    key === "Limerick" ? "/assets/limerick_crest_final.png" :
                                        key === "Tipperary" ? "/assets/tipperary_crest_final.png" :
                                            undefined
                                }
                            />

                            {/* No Extra Charge Note */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-6 flex flex-col items-center gap-2"
                            >
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">
                                    Premium Inclusive Pricing
                                </span>
                                <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
                                    No extra charge for custom additions like club sponsors, initials, or names on jerseys.
                                    Everything is included in the price.
                                </p>
                            </motion.div>
                        </div>

                        {/* Scrollable Row */}
                        <div className="relative w-full">
                            <div
                                className="flex gap-6 overflow-x-auto snap-x scrollbar-hide px-4 md:px-8 pb-12 pt-4"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {collection.products.map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="min-w-[280px] md:min-w-[320px] snap-start"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <ProductCard
                                            id={product.id}
                                            title={product.title}
                                            category={product.category}
                                            price={product.price}
                                            image={product.image}
                                            status={product.status} // Pass status
                                            onQuickAdd={() => setSelectedProduct(product)}
                                        />
                                    </div>
                                ))}

                                {/* View All Card */}
                                <div className="min-w-[280px] md:min-w-[320px] snap-start flex items-center justify-center">
                                    <a href={`/collections/${key.toLowerCase()}`} className="group flex flex-col items-center gap-4 p-8 border border-white/10 rounded-sm hover:border-primary/50 transition-colors bg-background-card h-full w-full justify-center">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <ArrowRight className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="text-white font-bold uppercase tracking-widest text-sm group-hover:text-primary transition-colors">
                                            View All {key}
                                        </span>
                                    </a>
                                </div>
                            </div>

                            {/* Fade Gradients for Scroll Indication */}
                            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-background to-transparent pointer-events-none md:block hidden" />
                        </div>
                    </section>
                ))}

                {collectionsToShow.length === 0 && (
                    <div className="py-20 text-center text-muted font-display uppercase tracking-widest">
                        No collections found
                    </div>
                )}

                {/* Shop All Products CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center pt-8 pb-16"
                >
                    <a
                        href="#shop"
                        className="group relative inline-flex items-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-12 py-5 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300"
                    >
                        Shop All Products
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                </motion.div>
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    );
}
