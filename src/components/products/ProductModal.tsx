"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
    id: string | number;
    title: string;
    price: string | number;
    image?: string;
    category: string;
    defaultKids?: boolean;
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

// Reduced motion check
const prefersReducedMotion =
    typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

const FLIP_TRANSITION = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.4, 0.0, 0.2, 1] as const };

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: prefersReducedMotion ? 0 : 0.15,
            staggerChildren: prefersReducedMotion ? 0 : 0.06,
        },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] as const },
    },
};

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [size, setSize] = useState("M");
    const [sizeType, setSizeType] = useState("Adults");
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    // Reset sizes when a new product is opened
    useEffect(() => {
        if (product) {
            if (product.defaultKids) {
                setSizeType("Kids");
                setSize("3-4Y");
            } else {
                setSizeType("Adults");
                setSize("M");
            }
            setQuantity(1);
        }
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            size,
            quantity
        });

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose();
        }, 1000);
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4 md:p-6"
                    >
                        <div className="bg-background-card pointer-events-auto border border-white/10 w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/50 hover:text-white z-20 bg-black/40 hover:bg-black/60 rounded-full p-2 backdrop-blur-sm transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Image Section — FLIP target */}
                            <div className="w-full md:w-1/2 bg-background-elevated aspect-square md:aspect-auto relative overflow-hidden">
                                <motion.div
                                    layoutId={`product-image-${product.id}`}
                                    transition={{ layout: FLIP_TRANSITION }}
                                    className="w-full h-full"
                                >
                                    {product.image ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-muted">No Image</span>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Details Section — stagger-fade in */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                                className="w-full md:w-1/2 p-8 md:p-12 flex flex-col"
                            >
                                <motion.span variants={staggerItem} className="text-sm font-bold tracking-widest text-primary uppercase mb-2">
                                    {product.category}
                                </motion.span>

                                {/* Title — FLIP target */}
                                <motion.div
                                    layoutId={`product-title-${product.id}`}
                                    transition={{ layout: FLIP_TRANSITION }}
                                >
                                    <h2 className="text-3xl font-display font-black text-white uppercase leading-none mb-4">
                                        {product.title}
                                    </h2>
                                </motion.div>

                                <motion.p variants={staggerItem} className="text-2xl font-bold text-price mb-6">
                                    {product.price}
                                </motion.p>

                                <motion.p variants={staggerItem} className="text-muted leading-relaxed mb-8">
                                    Premium performance fabric designed for elite athletes.
                                    Breathable, durable, and built to handle the intensity of the game.
                                </motion.p>

                                {/* Size Selector */}
                                <motion.div variants={staggerItem} className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">
                                        Select Size
                                    </h3>
                                    <div className="flex gap-2 mb-3">
                                        {["Kids", "Adults"].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => { setSizeType(tab); setSize(tab === "Kids" ? "3-4Y" : "M"); }}
                                                className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${sizeType === tab ? "bg-primary text-black" : "bg-white/5 text-muted hover:text-white border border-white/10"}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(sizeType === "Kids"
                                            ? ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"]
                                            : ["XS", "S", "M", "L", "XL", "2XL"]
                                        ).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSize(s)}
                                                className={`min-w-[48px] h-12 px-3 flex items-center justify-center border font-bold text-sm transition-all
                                                    ${size === s
                                                        ? "border-primary bg-primary text-black"
                                                        : "border-white/20 text-muted hover:border-white hover:text-white"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Actions */}
                                <motion.div variants={staggerItem} className="mt-auto space-y-3">
                                    {/* Quantity & Add */}
                                    <div className="flex gap-4">
                                        <div className="flex items-center border border-white/20 rounded-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-3 text-white hover:text-primary transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-white">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-3 text-white hover:text-primary transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(102,187,106,0.3)] flex items-center justify-center gap-2"
                                        >
                                            {isAdded ? "Added!" : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Buy Now */}
                                    <button
                                        onClick={() => {
                                            if (!product) return;
                                            addToCart({
                                                id: product.id,
                                                title: product.title,
                                                price: product.price,
                                                image: product.image,
                                                category: product.category,
                                                size,
                                                quantity
                                            });
                                            onClose();
                                            router.push("/checkout");
                                        }}
                                        className="w-full bg-[#81C784] text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 py-4 rounded-sm"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Buy it Now
                                    </button>

                                    {/* View Full Details */}
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors py-2"
                                    >
                                        View Full Details
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    {/* Trust Elements */}
                                    <div className="pt-4 mt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] text-muted font-medium uppercase tracking-wider">
                                        <div className="flex flex-col items-center gap-1">
                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Quality Guarantee
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Secure Checkout
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Fast Delivery
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
