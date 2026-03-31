"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Info, ShoppingBag, Plus, Minus, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { ReviewSection } from "@/components/products/ReviewSection";
import { ProductImageMagnifier } from "@/components/products/ProductImageMagnifier";
import { useCart } from "@/contexts/CartContext";
import { reserveProduct } from "./actions";
import { toast } from "sonner";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

const SIZE_CHART_JERSEY = "/assets/size-charts/jersey-size-chart.png";
const SIZE_CHART_SWEATER = "/assets/size-charts/sweater-size-chart.png";
const SIZE_CHART_JACKET = "/assets/size-charts/puffer-jacket-adult.png";

const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
};

export default function ProductClient({ product, initialReviews = [] }: { product: any, initialReviews?: any[] }) {
    const { isLoaded, isSignedIn } = useUser();
    const { addToCart } = useCart();

    const [activeTab, setActiveTab] = useState("description");
    const [sizeType, setSizeType] = useState(product?.defaultKids ? "Kids" : "Adults");
    const [selectedSize, setSelectedSize] = useState(product?.defaultKids ? "3-4Y" : "M");
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

    const isSizeChart = (img: string) => 
        img.includes('size-charts/') || 
        (product?.sizeChart && img === product.sizeChart) ||
        img === SIZE_CHART_JERSEY ||
        img === SIZE_CHART_SWEATER ||
        img === SIZE_CHART_JACKET;

    const priceNum = typeof product?.price === "number" ? product.price : parseFloat((product?.price || "0").replace(/[^0-9.]/g, ""));
    const additionTotal = (priceNum * quantity).toFixed(2);

    // Build thumbnails array
    const thumbnails: string[] = product?.images?.length > 0
        ? [...product.images]
        : (product?.image ? [product.image] : []);

    if (product?.sizeChart) {
        thumbnails.push(product.sizeChart);
    }
    if (sizeType === "Adults") {
        const titleLower = (product.title || "").toLowerCase();
        const categoryLower = (product.category || "").toLowerCase();
        
        if (titleLower.includes("jersey") || titleLower.includes("top") || categoryLower.includes("jersey")) {
            thumbnails.push(SIZE_CHART_JERSEY);
        } else if (titleLower.includes("sweater") || titleLower.includes("hoodie") || categoryLower.includes("sweater")) {
            thumbnails.push(SIZE_CHART_SWEATER);
        } else if (titleLower.includes("jacket") || categoryLower.includes("jacket")) {
            thumbnails.push(SIZE_CHART_JACKET);
        } else {
            // Default to Jersey chart if unknown but Adult
            thumbnails.push(SIZE_CHART_JERSEY);
        }
    }

    const safeIndex = Math.min(activeIndex, thumbnails.length - 1);
    const activeImage = thumbnails[safeIndex] || product?.image;

    const paginate = useCallback((newDirection: number) => {
        setActiveIndex(([prev]) => {
            const next = prev + newDirection;
            if (next < 0 || next >= thumbnails.length) return [prev, 0];
            return [next, newDirection];
        });
    }, [thumbnails.length]);

    const goToSlide = useCallback((index: number) => {
        setActiveIndex(([prev]) => [index, index > prev ? 1 : -1]);
    }, []);

    // Swipe handlers
    const swipeThreshold = 50;
    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > swipeThreshold) paginate(-1);
        else if (info.offset.x < -swipeThreshold) paginate(1);
    };

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted mb-4 sm:mb-6 md:mb-8 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/#shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-white truncate max-w-[200px]">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">

                    {/* LEFT: Image Gallery with Slider */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-3 sm:space-y-4"
                    >
                        {/* Main Image with Arrows */}
                        <div className="relative aspect-square sm:aspect-[3/4] bg-background-elevated rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 group">
                            
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={safeIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.05}
                                    onDragEnd={handleDragEnd}
                                    className="absolute inset-0"
                                >
                                    <ProductImageMagnifier
                                        src={activeImage}
                                        alt={product.title}
                                        className="w-full h-full"
                                        objectFit={isSizeChart(activeImage) ? 'contain' : 'cover'}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Category Badge */}
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none z-10">
                                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-widest border border-white/10">
                                    {product.category}
                                </span>
                            </div>

                            {/* Prev/Next Arrow Buttons */}
                            {thumbnails.length > 1 && (
                                <>
                                    <button
                                        onClick={() => paginate(-1)}
                                        disabled={safeIndex === 0}
                                        className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                                            safeIndex === 0
                                                ? 'bg-black/20 text-white/20 cursor-not-allowed'
                                                : 'bg-black/50 backdrop-blur-sm text-white hover:bg-primary hover:text-black hover:scale-110 active:scale-95 shadow-lg'
                                        }`}
                                    >
                                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                    <button
                                        onClick={() => paginate(1)}
                                        disabled={safeIndex >= thumbnails.length - 1}
                                        className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                                            safeIndex >= thumbnails.length - 1
                                                ? 'bg-black/20 text-white/20 cursor-not-allowed'
                                                : 'bg-black/50 backdrop-blur-sm text-white hover:bg-primary hover:text-black hover:scale-110 active:scale-95 shadow-lg'
                                        }`}
                                    >
                                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </>
                            )}

                            {/* Slide Counter */}
                            {thumbnails.length > 1 && (
                                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                                    {safeIndex + 1} / {thumbnails.length}
                                </div>
                            )}

                            {/* Dot Indicators (mobile) */}
                            {thumbnails.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 lg:hidden">
                                    {thumbnails.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goToSlide(i)}
                                            className={`rounded-full transition-all duration-300 ${
                                                i === safeIndex
                                                    ? 'w-6 h-2 bg-primary'
                                                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                            {thumbnails.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => goToSlide(i)}
                                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg border-2 snap-start ${
                                        safeIndex === i ? "border-primary shadow-[0_0_12px_rgba(102,187,106,0.3)]" : "border-white/10"
                                    } bg-background-elevated overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-200 relative`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${i + 1}`}
                                        width={96}
                                        height={96}
                                        className={`opacity-80 hover:opacity-100 transition-opacity ${isSizeChart(img) ? 'object-contain p-1 bg-black' : 'object-cover'}`}
                                    />
                                    {(product.sizeChart && img === product.sizeChart || img === SIZE_CHART_JERSEY || img === SIZE_CHART_SWEATER || img === SIZE_CHART_JACKET) && (
                                        <div className="absolute inset-0 flex items-end justify-center pb-1 bg-gradient-to-t from-black/60 to-transparent">
                                            <span className="text-[7px] sm:text-[8px] font-bold uppercase text-white bg-primary/80 px-1.5 py-0.5 rounded-sm tracking-wider">Size Chart</span>
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
                        className="space-y-6"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black text-white uppercase leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">€{priceNum}</span>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm border ${
                                product.stock_status === 'in_stock' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                product.stock_status === 'out_of_stock' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                                {String(product.stock_status || 'in_stock').replace('_', ' ')}
                            </span>
                        </div>

                        {/* Size Selector */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Select Size</h3>
                            <div className="flex gap-2 mb-3">
                                {["Kids", "Adults"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => { setSizeType(tab); setSelectedSize(tab === "Kids" ? "3-4Y" : "M"); setActiveIndex([0, 0]); }}
                                        className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                                            sizeType === tab ? "bg-primary text-black" : "bg-white/5 text-muted hover:text-white border border-white/10"
                                        }`}
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
                                        className={`min-w-[44px] sm:min-w-[48px] h-11 sm:h-12 px-3 flex items-center justify-center border font-bold text-sm transition-all rounded-sm ${
                                            selectedSize === s
                                                ? "border-primary bg-primary text-black"
                                                : "border-white/20 text-muted hover:border-white hover:text-white"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white/5 border border-primary/30 rounded-xl p-5 sm:p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="relative z-10">
                                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    Premium Quality Guarantee
                                </h3>
                                <p className="text-sm text-muted mb-3">
                                    Every piece of AF Gear teamwear is engineered for performance and durability.
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-wider">
                                    <Info className="w-3 h-3 text-primary" />
                                    <span>Fast lead times on all orders.</span>
                                </div>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className={`w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center border rounded-sm transition-all ${
                                        quantity <= 1 ? 'border-red-500/50 text-red-400 cursor-not-allowed' : 'border-white/20 text-white hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-bold text-white min-w-[32px] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center border border-white/20 text-white rounded-sm hover:border-primary hover:text-primary transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="flex gap-4">
                            <AnimatedButton
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
                                    toast.success(
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-sm">{quantity}x {product.title}</span>
                                            <span className="text-xs text-muted">Size {selectedSize} added to your cart.</span>
                                        </div>,
                                        { icon: <ShoppingBag className="w-4 h-4 text-primary" />, duration: 3000 }
                                    );
                                    setTimeout(() => setAddedToCart(false), 2000);
                                }}
                                variant="primary"
                                animation="pro-max"
                                className={`flex-1 w-full !py-4 !text-sm sm:!text-base ${addedToCart ? "!bg-green-500 !text-white !border-green-500 !shadow-[0_0_40px_rgba(34,197,94,0.4)]" : ""}`}
                            >
                                {addedToCart ? (
                                    <><Check className="w-5 h-5 animate-[bounce_0.5s_ease-out]" /> Added to Cart</>
                                ) : (
                                    <><ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" /> Add to Cart — €{additionTotal}</>
                                )}
                            </AnimatedButton>
                        </div>

                        {/* Trust Elements */}
                        <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[9px] sm:text-[10px] text-muted font-medium uppercase tracking-wider">
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
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { id: "description", label: "Description", content: "Engineered for elite performance. Featuring moisture-wicking technology, reinforced stitching for durability, and an athletic cut designed for movement. Perfect for match day or intense training sessions." },
                                { id: "shipping", label: "Shipping & Delivery", content: "Orders are processed within 24 hours. Standard delivery takes 3-5 business days. International shipping available." },
                                { id: "returns", label: "Returns Policy", content: "30-day return window for unworn items in original packaging. Customised teamwear cannot be returned unless faulty." },
                            ].map((tab) => (
                                <div key={tab.id} className="border-b border-white/10 pb-3 sm:pb-4">
                                    <button
                                        onClick={() => setActiveTab(activeTab === tab.id ? "" : tab.id)}
                                        className="w-full flex items-center justify-between text-left group py-1"
                                    >
                                        <span className={`text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id ? "text-primary" : "text-white group-hover:text-primary"}`}>
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
                                                <p className="pt-3 sm:pt-4 text-muted text-xs sm:text-sm leading-relaxed">
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
