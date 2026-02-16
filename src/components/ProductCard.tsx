"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductProps {
    id: number;
    title: string;
    price: string;
    image?: string;
    category: string;
    imageStyle?: React.CSSProperties;
    onQuickAdd?: () => void;
    status?: string;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
    Club: { bg: "bg-badge-club", text: "text-white" },
    Limerick: { bg: "bg-badge-limerick", text: "text-black" },
    Tipperary: { bg: "bg-badge-tipperary", text: "text-white" },
    Irish: { bg: "bg-badge-gaeilge", text: "text-white" },
    Gaeilge: { bg: "bg-badge-gaeilge", text: "text-white" },
};

export function ProductCard({ id, title, price, image, category, imageStyle, onQuickAdd, status = "live" }: ProductProps) {
    const isComingSoon = status === "coming_soon";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative w-full bg-transparent cursor-pointer"
        >
            {/* Image Container */}
            <div
                className="relative aspect-[3/4] overflow-hidden bg-background-elevated rounded-lg"
                onClick={() => {
                    if (isComingSoon) {
                        window.location.href = `/contact?subject=interest&product=${encodeURIComponent(title)}`;
                    } else {
                        onQuickAdd?.();
                    }
                }}
            >
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
                        {category}
                    </span>
                    {isComingSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-[#66BB6A] px-3 py-1.5 rounded-full w-fit">
                            Launching Soon
                        </span>
                    )}
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
                            if (isComingSoon) {
                                window.location.href = `/contact?subject=interest&product=${encodeURIComponent(title)}`;
                            } else {
                                onQuickAdd?.();
                            }
                        }}
                        className={`w-full font-bold text-xs uppercase tracking-widest py-3 rounded-sm transition-all duration-300 ${isComingSoon
                            ? "bg-white text-black hover:bg-white/90"
                            : "bg-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            }`}
                    >
                        {isComingSoon ? "Register Interest" : "Quick View"}
                    </button>
                </div>

                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-primary/30 transition-all duration-500 pointer-events-none" />
            </div>

            {/* Product Info */}
            <div className="pt-4 flex items-start justify-between gap-2">
                <div>
                    <h3
                        onClick={() => {
                            if (isComingSoon) {
                                window.location.href = `/contact?subject=interest&product=${encodeURIComponent(title)}`;
                            } else {
                                onQuickAdd?.();
                            }
                        }}
                        className="text-sm font-medium text-white/90 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300"
                    >
                        {title}
                    </h3>
                    <p className="text-price font-bold text-sm tracking-wide">
                        {isComingSoon ? "Coming Soon" : price}
                    </p>
                </div>

                {/* More Details Button */}
                <Link
                    href={isComingSoon ? `/contact?subject=interest&product=${encodeURIComponent(title)}` : `/product/${id}`}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 text-primary hover:text-white"
                    title={isComingSoon ? "Register Interest" : "View Full Details"}
                >
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            {/* Mobile-visible text link for better UX on touch */}
            <Link
                href={isComingSoon ? `/contact?subject=interest&product=${encodeURIComponent(title)}` : `/product/${id}`}
                className="md:hidden block mt-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
            >
                {isComingSoon ? "Register Interest →" : "View Full Details →"}
            </Link>
        </motion.div>
    );
}
