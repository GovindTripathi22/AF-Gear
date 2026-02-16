"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { COLLECTIONS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Footer } from "@/components/Footer";
import { Dock } from "@/components/Dock";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const COLLECTION_MAP: Record<string, keyof typeof COLLECTIONS> = {
    club: "Club",
    limerick: "Limerick",
    tipperary: "Tipperary",
    irish: "Irish",
};

const CREST_MAP: Record<string, string | undefined> = {
    limerick: "/assets/limerick_crest_final.png",
    tipperary: "/assets/tipperary_crest_final.png",
};

interface SelectedProduct {
    id: number;
    title: string;
    price: string;
    image?: string;
    category: string;
}

export default function CollectionPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

    const collectionKey = COLLECTION_MAP[slug];
    const collection = collectionKey ? COLLECTIONS[collectionKey] : null;
    const crest = CREST_MAP[slug];

    if (!collection) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h1 className="text-4xl font-display font-black text-white uppercase mb-4">
                    Collection Not Found
                </h1>
                <Link
                    href="/#shop"
                    className="text-primary font-bold uppercase tracking-widest text-sm hover:text-white transition-colors"
                >
                    ← Back to Shop
                </Link>
            </main>
        );
    }

    return (
        <>
            <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
                {/* Hero */}
                <section className="relative pt-36 pb-16 px-4 md:px-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />

                    <div className="relative max-w-[1600px] mx-auto">
                        <Link
                            href="/#shop"
                            className="inline-flex items-center gap-2 text-muted hover:text-primary text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Shop
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-6"
                        >
                            {crest && (
                                <motion.img
                                    src={crest}
                                    alt=""
                                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                />
                            )}
                            <div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase leading-[0.9]">
                                    {collection.title}
                                </h1>
                                <p className="text-muted text-lg mt-3 max-w-xl">{collection.subtitle}</p>
                            </div>
                        </motion.div>

                        <div className="mt-4 flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                <ShoppingBag className="w-3 h-3 inline mr-2" />
                                {collection.products.length} Products
                            </span>
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="px-4 md:px-8 pb-24">
                    <div className="max-w-[1600px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                        >
                            {collection.products.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                                    onClick={() => setSelectedProduct(product)}
                                    className="cursor-pointer"
                                >
                                    <ProductCard
                                        id={product.id}
                                        title={product.title}
                                        category={product.category}
                                        price={product.price}
                                        image={product.image}
                                        status={product.status} // Pass status here
                                        onQuickAdd={() => setSelectedProduct(product)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <Footer />
                <Dock />
            </main>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    );
}
