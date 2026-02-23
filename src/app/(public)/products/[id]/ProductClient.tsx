"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    ShieldCheck,
    Truck,
    RefreshCcw,
    Check,
    Lock,
    Info,
    ChevronDown,
    ChevronUp,
    Minus,
    Plus,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ReviewSection } from "@/components/products/ReviewSection";

import { ProductImageMagnifier } from "@/components/products/ProductImageMagnifier";
import { useCart } from "@/contexts/CartContext";
import { reserveProduct } from "./actions";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductClient({ product, initialReviews = [] }: { product: any, initialReviews?: any[] }) {
    const { isLoaded, isSignedIn } = useUser();
    const { addToCart } = useCart();

    const [reservedCount, setReservedCount] = useState(0);
    const [isReserving, setIsReserving] = useState(false);
    const [hasReserved, setHasReserved] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [sizeType, setSizeType] = useState(product?.defaultKids ? "Kids" : "Adults");
    const [selectedSize, setSelectedSize] = useState(product?.defaultKids ? "3-4Y" : "M");
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const [activeImageState, setActiveImage] = useState<string | null>(null);
    const activeImage = activeImageState || product?.image;

    useEffect(() => {
        // Fetch real reserved count optionally, but since it requires another check on load we'll just check localStorage for UI sake or pass from parent.
        // For simplicity right now we'll just leave count as is.
        if (typeof window !== "undefined") {
            const hasReservedLocal = localStorage.getItem(`user_reserved_${product?.id}`);
            if (hasReservedLocal) {
                setHasReserved(true);
            }
        }
    }, [product?.id]);

    const handleReserve = async () => {
        if (!isSignedIn) {
            toast.error("Please login to reserve an item.");
            return;
        }

        if (hasReserved || isReserving) return;

        setIsReserving(true);

        const result = await reserveProduct({
            productId: product.id,
            productName: product.title,
            size: selectedSize,
            quantity
        });

        if (result?.error) {
            toast.error(result.error);
            setIsReserving(false);
            return;
        }

        const newCount = reservedCount + quantity;
        setReservedCount(newCount);
        setHasReserved(true);
        localStorage.setItem(`reservation_count_${product?.id}`, newCount.toString());
        localStorage.setItem(`user_reserved_${product?.id}`, "true");
        setIsReserving(false);
        toast.success("Item successfully reserved!");
    };

    const GOAL = 10;
    const progressPercentage = Math.min((reservedCount / GOAL) * 100, 100);

    // Generate thumbnails from actual product images
    const thumbnails = product?.images?.length > 0
        ? [...product.images]
        : (product?.image ? [product.image] : []);

    if (product?.sizeChart) {
        thumbnails.push(product.sizeChart);
    }

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">

            <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/#shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-white">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* LEFT: Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="relative aspect-[3/4] bg-background-elevated rounded-2xl overflow-hidden border border-white/5 group">
                            <ProductImageMagnifier
                                src={activeImage || product.image}
                                alt={product.title}
                                className="w-full h-full"
                            />
                            {/* Category Badge */}
                            <div className="absolute top-4 left-4 pointer-events-none">
                                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                                    {product.category}
                                </span>
                            </div>
                        </div>
                        {/* Thumbnails */}
                        <div className="flex flex-wrap gap-4">
                            {thumbnails.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg border flex-shrink-0 ${activeImage === img ? "border-primary" : "border-white/10"} bg-background-elevated overflow-hidden cursor-pointer hover:border-primary/50 transition-colors relative`}
                                >
                                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                                    {/* Label for Size Chart */}
                                    {product.sizeChart && img === product.sizeChart && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <span className="text-[8px] font-bold uppercase text-white bg-black/60 px-1 rounded">Size</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-display font-black text-white uppercase leading-tight mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl md:text-3xl font-bold text-primary">{product.price}</span>
                        </div>

                        {/* STOCK STATUS BADGE */}
                        <div className="mb-8 flex items-center gap-2">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm border ${product.stock_status === 'in_stock' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                product.stock_status === 'out_of_stock' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-amber-500/10 text-amber-400 border-amber-500/20' // limited
                                }`}>
                                {String(product.stock_status || 'in_stock').replace('_', ' ')}
                            </span>
                        </div>

                        {/* SIZE SELECTOR */}
                        <div className="mb-10">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Select Size</h3>
                            <div className="flex gap-2 mb-3">
                                {["Kids", "Adults"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => { setSizeType(tab); setSelectedSize(tab === "Kids" ? "3-4Y" : "M"); }}
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
                                        onClick={() => setSelectedSize(s)}
                                        className={`min-w-[48px] h-12 px-3 flex items-center justify-center border font-bold text-sm transition-all rounded-sm ${selectedSize === s
                                            ? "border-primary bg-primary text-black"
                                            : "border-white/20 text-muted hover:border-white hover:text-white"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RESERVATION CARD */}
                        <div className="bg-white/5 border border-primary/30 rounded-xl p-6 md:p-8 mb-10 relative overflow-hidden">
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary" />
                                    Reserve Your Item
                                </h3>

                                <p className="text-sm text-muted mb-6">
                                    Join the group order! This product enters production once <strong>{GOAL} items</strong> are reserved.
                                    Your card is <strong>pre-authorized only</strong> — you won&apos;t be charged until the goal is met.
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white mb-2">
                                        <span>Progress</span>
                                        <span>{reservedCount} / {GOAL} Reserved</span>
                                    </div>
                                    <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-primary relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                {hasReserved ? (
                                    <button
                                        disabled
                                        className="w-full bg-white/10 text-primary border border-primary/20 font-black uppercase tracking-widest py-4 rounded-sm flex items-center justify-center gap-2 cursor-default"
                                    >
                                        <Check className="w-5 h-5" />
                                        You Have Reserved This Item
                                    </button>
                                ) : (
                                    <div className="relative group/reserve">
                                        <div className="absolute inset-0 bg-primary/40 rounded-sm blur-md group-hover/reserve:bg-primary/60 transition-colors duration-300 animate-pulse" />
                                        <button
                                            onClick={handleReserve}
                                            disabled={isReserving}
                                            className="relative z-10 w-full bg-primary text-black font-black uppercase tracking-[0.15em] py-4 rounded-sm hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                                        >
                                            {isReserving ? (
                                                <>Processing...</>
                                            ) : (
                                                <>
                                                    Reserve Now
                                                    <span className="text-[10px] opacity-70 font-medium ml-1 bg-black/10 px-2 py-0.5 rounded">Pay €0.00 Today</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted uppercase tracking-wider">
                                    <ShieldCheck className="w-3 h-3 text-primary" />
                                    <span>Secure Pre-Authorization via Stripe</span>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center border border-white/20 text-white rounded-sm hover:border-primary hover:text-primary transition-all"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-bold text-white min-w-[32px] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center border border-white/20 text-white rounded-sm hover:border-primary hover:text-primary transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Standard Actions */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => {
                                    if (!product) return;
                                    addToCart({
                                        id: product.id,
                                        title: product.title,
                                        price: product.price,
                                        image: product.image,
                                        category: product.category,
                                        size: selectedSize,
                                        quantity,
                                    });
                                    setAddedToCart(true);
                                    setTimeout(() => setAddedToCart(false), 2000);
                                }}
                                className={`flex-1 font-bold uppercase tracking-widest py-4 rounded-sm transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden relative group/add ${addedToCart
                                    ? "bg-green-500 text-white border border-green-500 scale-[1.02] shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                                    : "bg-primary text-black hover:scale-[1.02] hover:shadow-[0_0_30px_var(--color-primary-glow)]"
                                    }`}
                            >
                                {/* Ripple effect overlay when not added */}
                                {!addedToCart && <div className="absolute inset-x-0 bottom-0 h-0 bg-white/20 group-active/add:h-full transition-all duration-300 ease-out z-0" />}

                                <span className="relative z-10 flex items-center gap-2">
                                    {addedToCart ? (
                                        <><Check className="w-5 h-5 animate-[bounce_0.5s_ease-out]" /> Added to Cart</>
                                    ) : (
                                        <><ShoppingBag className="w-5 h-5 group-hover/add:-translate-y-1 transition-transform duration-300" /> Add to Cart — {product.price}</>
                                    )}
                                </span>
                            </button>
                        </div>

                        {/* Trust Elements */}
                        <div className="mb-12 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] text-muted font-medium uppercase tracking-wider">
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Quality Guarantee
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Secure Checkout
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Fast Delivery
                            </div>
                        </div>

                        {/* Info Tabs */}
                        <div className="space-y-4">
                            {[
                                { id: "description", label: "Description", content: "Engineered for elite performance. Featuring moisture-wicking technology, reinforced stitching for durability, and an athletic cut designed for movement. Perfect for match day or intense training sessions." },
                                { id: "shipping", label: "Shipping & Delivery", content: "Orders are processed within 24 hours. Standard delivery takes 3-5 business days. International shipping available." },
                                { id: "returns", label: "Returns Policy", content: "30-day return window for unworn items in original packaging. Customised teamwear cannot be returned unless faulty." },
                            ].map((tab) => (
                                <div key={tab.id} className="border-b border-white/10 pb-4">
                                    <button
                                        onClick={() => setActiveTab(activeTab === tab.id ? "" : tab.id)}
                                        className="w-full flex items-center justify-between text-left group"
                                    >
                                        <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id ? "text-primary" : "text-white group-hover:text-primary"}`}>
                                            {tab.label}
                                        </span>
                                        {activeTab === tab.id ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeTab === tab.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pt-4 text-muted text-sm leading-relaxed">
                                                    {tab.content}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <ReviewSection
                    productId={product.id}
                    initialReviews={initialReviews}
                    isSignedIn={!!isSignedIn}
                />
            </div>

        </main>
    );
}
