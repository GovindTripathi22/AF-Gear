"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";
<<<<<<< HEAD
=======
import { AnimatedButton } from "@/components/ui/AnimatedButton";
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822

interface ProductProps {
    id: string | number;
    title: string;
    price: string | number;
    image?: string;
    category: string;
    imageStyle?: React.CSSProperties;
    onQuickAdd?: () => void;
    status?: string;
    sizeChart?: string;
<<<<<<< HEAD
=======
    isHero?: boolean;
    isKids?: boolean;
    stockStatus?: string;
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
}

const categoryColors: Record<string, { bg: string; text: string }> = {
    Club: { bg: "bg-badge-club", text: "text-white" },
    Limerick: { bg: "bg-badge-limerick", text: "text-black" },
    Tipperary: { bg: "bg-badge-tipperary", text: "text-white" },
    Irish: { bg: "bg-badge-gaeilge", text: "text-white" },
    Gaeilge: { bg: "bg-badge-gaeilge", text: "text-white" },
};

<<<<<<< HEAD
export function ProductCard({ id, title, price, image, category, imageStyle, onQuickAdd, status = "live", sizeChart }: ProductProps) {
=======
export function ProductCard({ id, title, price, image, category, imageStyle, onQuickAdd, status = "live", sizeChart, isHero = false, isKids, stockStatus = "in_stock" }: ProductProps) {
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
    const isComingSoon = status === "coming_soon";
    const [showSizeChart, setShowSizeChart] = useState(false);
    const hoverTimer = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (!sizeChart) return;
        hoverTimer.current = setTimeout(() => {
            setShowSizeChart(true);
        }, 2800);
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setShowSizeChart(false);
    };

    const productHref = isComingSoon
        ? `/contact?subject=interest&product=${encodeURIComponent(title)}`
<<<<<<< HEAD
        : `/product/${id}`;
=======
        : `/products/${id}${isKids ? "?type=kids" : ""}`;
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative w-full bg-transparent cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
<<<<<<< HEAD
            {/* Image Container — NOT wrapped in Link so buttons work independently */}
            <div className="relative aspect-[3/4] overflow-hidden bg-background-elevated rounded-lg">
=======
            {/* Image Container */}
            <div className={`relative ${isHero ? "aspect-[4/5] lg:aspect-square" : "aspect-[3/4]"} overflow-hidden bg-background-elevated rounded-lg`}>
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
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
<<<<<<< HEAD
                </div>

                {/* Clickable image area — navigates to product page */}
                <Link href={productHref} className="block w-full h-full">
                    <div className="w-full h-full transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.08]">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="w-full h-full object-cover"
                                style={imageStyle}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background-elevated to-background">
                                <span className="text-muted/40 text-sm font-medium">{title}</span>
                            </div>
                        )}
                    </div>
=======
                    {stockStatus !== 'in_stock' && !isComingSoon && (
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit ${stockStatus === 'out_of_stock' ? 'bg-red-500/90 text-white' :
                            'bg-amber-500/90 text-black' // limited
                            }`}>
                            {String(stockStatus).replace('_', ' ')}
                        </span>
                    )}
                </div>

                {/* Product Image — FLIP source with layoutId */}
                <Link href={productHref} className="block w-full h-full">
                    <motion.div
                        layoutId={`product-image-${id}`}
                        transition={{
                            layout: {
                                duration: 0.35,
                                ease: [0.4, 0.0, 0.2, 1],
                            },
                        }}
                        className="w-full h-full"
                    >
                        <div className="w-full h-full transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.08] relative">
                            {image ? (
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    style={imageStyle}
                                    priority={isHero}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background-elevated to-background">
                                    <span className="text-muted/40 text-sm font-medium">{title}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
                </Link>

                {/* Size Chart Overlay */}
                <AnimatePresence>
                    {showSizeChart && sizeChart && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 z-30 bg-background-elevated flex items-center justify-center p-2"
                        >
                            <img src={sizeChart} alt="Size Chart" className="w-full h-full object-contain" />
                            <div className="absolute bottom-2 left-0 right-0 text-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-white/90 px-2 py-1 rounded-sm">Size Chart</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

<<<<<<< HEAD
                {/* Quick View + View Details Buttons — slide up on hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-t from-black/98 via-black/80 to-transparent pt-12 z-40">
                    <div className="flex flex-col gap-2">
                        {/* Quick View Button — opens modal */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
=======
                {/* Quick View + View Details Buttons */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-t from-black/98 via-black/80 to-transparent pt-12 z-40">
                    <div className="flex flex-col gap-2">
                        <AnimatedButton
                            onClick={() => {
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
                                if (isComingSoon) {
                                    window.location.href = productHref;
                                } else {
                                    onQuickAdd?.();
                                }
                            }}
<<<<<<< HEAD
                            className={`w-full font-bold text-xs uppercase tracking-widest py-3 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 ${isComingSoon
                                ? "bg-white text-black hover:bg-white/90"
                                : "bg-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                }`}
                        >
                            <Eye className="w-4 h-4" />
                            {isComingSoon ? "Register Interest" : "Quick View"}
                        </button>

                        {/* View Details Button — opens dedicated page */}
                        {!isComingSoon && (
                            <Link
                                href={productHref}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full font-bold text-xs uppercase tracking-widest py-3 rounded-sm transition-all duration-300 bg-white/10 text-white hover:bg-white/20 text-center flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
                            >
                                View Details
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
=======
                            variant={isComingSoon ? "secondary" : "primary"}
                            animation="gloss"
                            className="w-full !py-3 !px-4 text-xs flex justify-center items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            {isComingSoon ? "Register Interest" : "Quick View"}
                        </AnimatedButton>

                        {!isComingSoon && (
                            <AnimatedButton
                                href={productHref}
                                variant="outline"
                                animation="magnetic"
                                className="w-full !py-3 !px-4 text-xs flex justify-center items-center gap-2 backdrop-blur-sm bg-black/40"
                            >
                                View Details
                                <ArrowRight className="w-3.5 h-3.5" />
                            </AnimatedButton>
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
                        )}
                    </div>
                </div>

<<<<<<< HEAD
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-primary/30 transition-all duration-500 pointer-events-none z-50" />
            </div>

            {/* Product Info */}
            <div className="pt-4 flex items-start justify-between gap-2">
                <div>
                    <Link
                        href={productHref}
                        className="text-sm font-medium text-white/90 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300 block"
                    >
                        {title}
                    </Link>
=======
                {/* Border glow */}
                <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-primary/30 transition-all duration-500 pointer-events-none z-50" />
            </div>

            {/* Product Info — FLIP source for title */}
            <div className="pt-4 flex items-start justify-between gap-2">
                <div>
                    <motion.div
                        layoutId={`product-title-${id}`}
                        transition={{
                            layout: {
                                duration: 0.35,
                                ease: [0.4, 0.0, 0.2, 1],
                            },
                        }}
                    >
                        <Link
                            href={productHref}
                            className="text-sm font-medium text-white/90 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300 block"
                        >
                            {title}
                        </Link>
                    </motion.div>
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
                    <p className="text-price font-bold text-sm tracking-wide">
                        {isComingSoon ? "Coming Soon" : price}
                    </p>
                </div>

<<<<<<< HEAD
                {/* Arrow Button */}
=======
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
                <Link
                    href={productHref}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 text-primary hover:text-white relative overflow-hidden group/arrow"
                    title={isComingSoon ? "Register Interest" : "View Full Details"}
                >
                    <ArrowRight className="w-4 h-4 group-hover/arrow:translate-x-[150%] transition-transform duration-300 ease-in" />
                    <ArrowRight className="w-4 h-4 absolute inset-0 m-auto -translate-x-[150%] group-hover/arrow:translate-x-0 transition-transform duration-300 delay-100 ease-out" />
                </Link>
            </div>

<<<<<<< HEAD
            {/* Mobile-visible text link */}
=======
            {/* Mobile link */}
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
            <Link
                href={productHref}
                className="md:hidden block mt-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors"
            >
                {isComingSoon ? "Register Interest →" : "View Full Details →"}
            </Link>
        </motion.div>
    );
}
