"use client";

import { motion } from "framer-motion";

interface ProductProps {
    title: string;
    price: string;
    image?: string;
    category: string;
    imageStyle?: React.CSSProperties;
    onQuickAdd?: () => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
    Club: { bg: "bg-badge-club", text: "text-white" },
    Limerick: { bg: "bg-badge-limerick", text: "text-black" },
    Tipperary: { bg: "bg-badge-tipperary", text: "text-white" },
    Irish: { bg: "bg-badge-gaeilge", text: "text-white" },
    Gaeilge: { bg: "bg-badge-gaeilge", text: "text-white" },
};

export function ProductCard({ title, price, image, category, imageStyle, onQuickAdd }: ProductProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative w-full bg-transparent cursor-pointer"
            onClick={() => onQuickAdd?.()}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-background-elevated rounded-lg">
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                        {category}
                    </span>
                </div>

                {/* Product Image — Smooth zoom on hover */}
                <div className="w-full h-full transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.08]">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                            style={imageStyle}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background-elevated to-background">
                            <span className="text-muted/40 text-sm font-medium">{title}</span>
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay — Smooth slide up */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickAdd?.();
                        }}
                        className="w-full bg-primary text-black font-bold text-xs uppercase tracking-widest py-3 rounded-sm hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
                    >
                        Quick View
                    </button>
                </div>

                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-primary/30 transition-all duration-500 pointer-events-none" />
            </div>

            {/* Product Info */}
            <div className="pt-4">
                <h3 className="text-sm font-medium text-white/90 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-price font-bold text-sm tracking-wide">
                    {price}
                </p>
            </div>
        </motion.div>
    );
}
