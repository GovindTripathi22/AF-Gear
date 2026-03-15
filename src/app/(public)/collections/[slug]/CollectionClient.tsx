"use client";

import { use } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductModal } from "@/components/products/ProductModal";
import { Footer } from "@/components/ui/Footer";
import { Dock } from "@/components/ui/Dock";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useScroll, useTransform } from "framer-motion";

const COLLECTION_MAP: Record<string, string> = {
    club: "Club",
    limerick: "Limerick",
    tipperary: "Tipperary",
    irish: "Irish",
    gaeilge: "Irish",
    gagileg: "Irish", // User typo fallback
};

const TAGLINE_MAP: Record<string, string> = {
    club: "CLUB GEAR",
    limerick: "TREATY CITY",
    tipperary: "PREMIER COUNTY",
    irish: "GAEILGE",
    gaeilge: "GAEILGE",
    gagileg: "GAEILGE",
};

const CREST_MAP: Record<string, string | undefined> = {
    limerick: "/assets/limerick_crest_final.png",
    tipperary: "/assets/tipperary_crest_final.png",
};

interface SelectedProduct {
    id: string | number;
    title: string;
    price: string | number;
    image?: string;
    category: string;
    status?: string;
}

export default function CollectionClient({
    slug,
    products
}: {
    slug: string;
     
    products: any[];
}) {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

    const collectionKey = COLLECTION_MAP[slug];
    const crest = CREST_MAP[slug];
    const tagline = TAGLINE_MAP[slug] || "AF GEAR";

    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 1000], ["0%", "30%"]);
    const titleGlow = useTransform(scrollY, [0, 200], [0.3, 0.6]);

    // Filter products by category
    const collectionProducts = products
        .filter(p => collectionKey ? p.category === collectionKey : true)
        .map(p => ({
            id: p.id,
            title: p.name,
            price: p.price ? `€${p.price}` : 'Contact for Price',
            image: p.images?.[0] || '/placeholder.png',
            category: p.category,
            status: p.product_status,
            stockStatus: p.stock_status
        }));

    const collection = {
        title: collectionKey || "Collection",
        subtitle: `Premium ${collectionKey || ''} Selection`,
        products: collectionProducts
    };

    if (!collectionKey) {
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
        <LayoutGroup>
            <main className="min-h-screen bg-background selection:bg-primary selection:text-black relative">

                {/* Parallax Background Text */}
                <motion.div
                    style={{ y: parallaxY }}
                    className="fixed top-[15%] w-full overflow-hidden whitespace-nowrap opacity-[0.02] select-none pointer-events-none z-0 flex justify-center"
                >
                    <h2 className="text-[25vw] font-display font-black text-white leading-none tracking-tighter">
                        {tagline}
                    </h2>
                </motion.div>

                {/* Kinetic Hero */}
                <section className="relative pt-32 pb-20 px-4 md:px-8 min-h-[55vh] flex flex-col justify-center items-center z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                    <Link
                        href="/#shop"
                        className="absolute top-24 left-4 md:left-8 inline-flex items-center gap-2 text-muted hover:text-white text-xs font-bold uppercase tracking-widest transition-colors z-20 backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>

                    <div className="relative w-full max-w-[1600px] mx-auto flex flex-col items-center">
                        {crest ? (
                            <motion.img
                                src={crest}
                                alt=""
                                className="w-20 h-20 md:w-28 md:h-28 object-contain mb-6 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        ) : (
                            <div className="h-16" />
                        )}

                        {/* Title - Fully Visible */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-6xl md:text-8xl lg:text-[10rem] font-display font-black uppercase leading-[0.85] text-center"
                        >
                            <span className="text-primary drop-shadow-[0_0_60px_rgba(74,222,128,0.3)]">
                                {collection.title}
                            </span>
                        </motion.h1>

                        {/* Subtle outline echo behind */}
                        <motion.div
                            style={{ opacity: titleGlow }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                        >
                            <h1
                                className="text-7xl md:text-9xl lg:text-[12rem] font-display font-black uppercase leading-[0.85] text-transparent opacity-[0.04] blur-[1px]"
                                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)" }}
                            >
                                {collection.title}
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-muted text-lg md:text-2xl mt-6 max-w-2xl text-center font-medium leading-relaxed"
                        >
                            {collection.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="mt-6"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20">
                                <ShoppingBag className="w-4 h-4 inline mr-2 -translate-y-0.5" />
                                {collection.products.length} Exclusive Items
                            </span>
                        </motion.div>
                    </div>
                </section>

                {/* Product Grid - Magazine Bento */}
                <section className="relative px-4 md:px-8 pb-32 z-10">
                    <div className="max-w-[1600px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
                        >
                            {collection.products.map((product, i) => {
                                const isHero = i === 0;
                                const isAccent = i === 3 || i === 6;
                                const spanClass = isHero
                                    ? "col-span-2 row-span-2"
                                    : isAccent
                                        ? "md:col-span-2 lg:col-span-1"
                                        : "";
                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.05 }}
                                        transition={{
                                            delay: 0.06 * i,
                                            duration: 0.5,
                                            ease: [0.25, 0.1, 0.25, 1],
                                        }}
                                        className={`${spanClass} group/card relative`}
                                    >
                                        <ProductCard
                                            id={product.id}
                                            title={product.title}
                                            category={product.category}
                                            price={product.price}
                                            image={product.image}
                                            status={product.status}
                                            stockStatus={(product as any).stockStatus}
                                            isHero={isHero}
                                            onQuickAdd={() => setSelectedProduct(product)}
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>


            </main>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            <Footer />
            <Dock />
        </LayoutGroup>
    );
}
