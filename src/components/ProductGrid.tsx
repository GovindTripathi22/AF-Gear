"use client";

import { ProductCard } from "./ProductCard";
import { CollectionHeader } from "./Collections/CollectionHeader";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ProductModal } from "./ProductModal";

interface ProductGridProps {
    filter: string;
}

const COLLECTIONS = {
    Club: {
        title: "CLUB BEFORE EVERYTHING",
        subtitle: "Premium teamwear for your club identity",
        products: [
            { id: 1, title: "Club Elite Home Jersey", category: "Club", price: "€54.99", image: "/assets/1000030808.png" },
            { id: 2, title: "Club Away Jersey", category: "Club", price: "€54.99", image: "/assets/1000030809.png" },
            { id: 3, title: "Club Training Jacket", category: "Club", price: "€69.99", image: "/assets/1000031016.png" },
            { id: 4, title: "Club Quarter-Zip", category: "Club", price: "€44.99", image: "/assets/1000030821.png" },
            { id: 5, title: "Club Performance Top", category: "Club", price: "€39.99", image: "/assets/1000031017.png" },
            { id: 6, title: "Club Rain Shell", category: "Club", price: "€74.99", image: "/assets/1000031016.png" },
            { id: 7, title: "Club Match Jersey", category: "Club", price: "€54.99", image: "/assets/1000030808.png" },
            { id: 8, title: "Club Elite Shorts", category: "Club", price: "€29.99", image: "/assets/1000031017.png" },
        ]
    },
    Limerick: {
        title: "THE LIMERICK COLLECTION",
        subtitle: "Treaty City pride in every stitch",
        products: [
            { id: 9, title: "Limerick Home Jersey", category: "Limerick", price: "€54.99", image: "/assets/1000030323.png" },
            { id: 10, title: "Limerick Away Jersey", category: "Limerick", price: "€54.99", image: "/assets/1000030251.png" },
            { id: 11, title: "Limerick Training Kit", category: "Limerick", price: "€49.99", image: "/assets/1000029834.png" },
            { id: 12, title: "Limerick Official Crest Tee", category: "Limerick", price: "€29.99", image: "/assets/1000015896.png" },
            { id: 13, title: "Limerick Performance Polo", category: "Limerick", price: "€39.99", image: "/assets/1000016812.jpg" },
            { id: 14, title: "Limerick Match Shorts", category: "Limerick", price: "€27.99", image: "/assets/1000026154.jpg" },
            { id: 15, title: "Treaty City Hoodie", category: "Limerick", price: "€64.99", image: "/assets/1000030323.png" },
            { id: 16, title: "Limerick Training Shell", category: "Limerick", price: "€72.50", image: "/assets/1000030251.png" },
        ]
    },
    Tipperary: {
        title: "THE TIPPERARY COLLECTION",
        subtitle: "Premier County excellence on and off the field",
        products: [
            { id: 17, title: "Tipperary Home Jersey", category: "Tipperary", price: "€54.99", image: "/assets/1000030324.png" },
            { id: 18, title: "Tipperary Away Jersey", category: "Tipperary", price: "€54.99", image: "/assets/1000030248.png" },
            { id: 19, title: "Tipperary Training Top", category: "Tipperary", price: "€49.99", image: "/assets/1000031376.png" },
            { id: 20, title: "Tipperary Match Kit", category: "Tipperary", price: "€59.99", image: "/assets/1000029954.png" },
            { id: 21, title: "Tipperary Performance Jacket", category: "Tipperary", price: "€82.50", image: "/assets/1000029835.png" },
            { id: 22, title: "Tipperary Polo Shirt", category: "Tipperary", price: "€38.99", image: "/assets/1000028906.png" },
            { id: 23, title: "Tipperary Training Jersey", category: "Tipperary", price: "€44.99", image: "/assets/1000024963.jpg" },
            { id: 24, title: "Tipperary Retro Tee", category: "Tipperary", price: "€32.50", image: "/assets/1000025706.jpg" },
        ]
    },
    Irish: {
        title: "IRISH LANGUAGE COLLECTION",
        subtitle: "Promote Gaeilge in your school or club — Custom Irish language jerseys available for teams",
        products: [
            { id: 25, title: "Tóg go Bog é Tee", category: "Gaeilge", price: "€34.99", image: "/assets/1000016844.png" },
            { id: 26, title: "Fan Socair Hoodie", category: "Gaeilge", price: "€62.50", image: "/assets/1000016604.png" },
            { id: 27, title: "Heritage Graphic Tee", category: "Gaeilge", price: "€32.99", image: "/assets/1000017537.jpg" },
            { id: 28, title: "Celtic Script Polo", category: "Gaeilge", price: "€39.99", image: "/assets/1000017694.jpg" },
            { id: 29, title: "Shamrock Performance Tee", category: "Gaeilge", price: "€34.99", image: "/assets/1000018054.jpg" },
            { id: 30, title: "Emerald Isle Sweatshirt", category: "Gaeilge", price: "€54.99", image: "/assets/1000018063.jpg" },
            { id: 31, title: "Tradition Crest Tee", category: "Gaeilge", price: "€29.99", image: "/assets/1000018066.jpg" },
            { id: 32, title: "Irish Legend Zip", category: "Gaeilge", price: "€67.50", image: "/assets/1000018069.jpg" },
        ]
    }
};

interface SelectedProduct {
    id: number;
    title: string;
    price: string;
    image?: string;
    category: string;
}

export function ProductGrid({ filter }: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

    const collectionsToShow = filter === "All"
        ? Object.entries(COLLECTIONS)
        : Object.entries(COLLECTIONS).filter(([key]) => {
            if (filter === "Club") return key === "Club";
            if (filter === "Limerick") return key === "Limerick";
            if (filter === "Tipperary") return key === "Tipperary";
            if (filter === "Irish") return key === "Irish";
            return false;
        });

    return (
        <>
            <div className="w-full max-w-[1920px] mx-auto pb-32 overflow-hidden">
                {collectionsToShow.map(([key, collection]) => (
                    <section key={key} className="mb-24 relative">
                        <div className="px-4 md:px-8 max-w-[1600px] mx-auto">
                            <CollectionHeader
                                title={collection.title}
                                subtitle={collection.subtitle}
                                crestImage={
                                    key === "Limerick" ? "/assets/limerick_crest_final.png" :
                                        key === "Tipperary" ? "/assets/tipperary_crest_final.png" :
                                            undefined
                                }
                            />
                        </div>

                        {/* Scrollable Row */}
                        <div className="relative w-full">
                            <div
                                className="flex gap-6 overflow-x-auto snap-x scrollbar-hide px-4 md:px-8 pb-12 pt-4"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {collection.products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="min-w-[280px] md:min-w-[320px] snap-start"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <ProductCard
                                            title={product.title}
                                            category={product.category}
                                            price={product.price}
                                            image={product.image}
                                            onQuickAdd={() => setSelectedProduct(product)}
                                        />
                                    </div>
                                ))}

                                {/* View All Card */}
                                <div className="min-w-[280px] md:min-w-[320px] snap-start flex items-center justify-center">
                                    <a href={`#${key.toLowerCase()}`} className="group flex flex-col items-center gap-4 p-8 border border-white/10 rounded-sm hover:border-primary/50 transition-colors bg-background-card h-full w-full justify-center">
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
                        className="group relative inline-flex items-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-12 py-5 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(0,191,165,0.4)] transition-all duration-300"
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
