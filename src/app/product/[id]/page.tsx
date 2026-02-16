"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ALL_PRODUCTS } from "@/lib/products";
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
    ChevronUp
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Dock } from "@/components/Dock";
import { ProductImageMagnifier } from "@/components/ProductImageMagnifier";

export default function ProductPage() {
    const params = useParams();
    const id = Number(params.id);
    const product = ALL_PRODUCTS.find((p) => p.id === id);

    const [reservedCount, setReservedCount] = useState(0);
    const [isReserving, setIsReserving] = useState(false);
    const [hasReserved, setHasReserved] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [sizeType, setSizeType] = useState("Adults");
    const [selectedSize, setSelectedSize] = useState("M");

    // Load reservation state from localStorage
    useEffect(() => {
        if (!product) return;
        const savedCount = localStorage.getItem(`reservation_count_${product.id}`);
        const userReserved = localStorage.getItem(`user_reserved_${product.id}`);

        if (savedCount) setReservedCount(parseInt(savedCount));
        if (userReserved) setHasReserved(true);

        // Simulate some random existing reservations if none exist, for demo purposes
        if (!savedCount) {
            const randomStart = Math.floor(Math.random() * 5); // 0 to 4
            setReservedCount(randomStart);
            localStorage.setItem(`reservation_count_${product.id}`, randomStart.toString());
        }
    }, [product]);

    const handleReserve = () => {
        if (hasReserved || isReserving) return;

        setIsReserving(true);

        // Simulate API call
        setTimeout(() => {
            const newCount = reservedCount + 1;
            setReservedCount(newCount);
            setHasReserved(true);
            localStorage.setItem(`reservation_count_${product?.id}`, newCount.toString());
            localStorage.setItem(`user_reserved_${product?.id}`, "true");
            setIsReserving(false);
        }, 1500);
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
                    <Link href="/" className="text-primary hover:underline">Return to Shop</Link>
                </div>
            </div>
        );
    }

    const GOAL = 10;
    const progressPercentage = Math.min((reservedCount / GOAL) * 100, 100);

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <Navbar />

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
                                src={product.image}
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
                        {/* Thumbnails (Mock) */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`aspect-square rounded-lg border ${i === 1 ? "border-primary" : "border-white/10"} bg-background-elevated overflow-hidden cursor-pointer hover:border-primary/50 transition-colors`}>
                                    <img src={product.image} alt="Thumbnail w-full h-full object-cover opacity-80 hover:opacity-100" />
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

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl md:text-3xl font-bold text-primary">{product.price}</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4" />
                                <span className="text-sm text-muted ml-2">(4.8 Stars)</span>
                            </div>
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
                                    Your card is <strong>pre-authorized only</strong> — you won't be charged until the goal is met.
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
                                    <button
                                        onClick={handleReserve}
                                        disabled={isReserving}
                                        className="w-full bg-primary text-black font-black uppercase tracking-[0.15em] py-4 rounded-sm hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
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
                                )}

                                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted uppercase tracking-wider">
                                    <ShieldCheck className="w-3 h-3 text-primary" />
                                    <span>Secure Pre-Authorization via Stripe</span>
                                </div>
                            </div>
                        </div>

                        {/* Standard Actions */}
                        <div className="flex gap-4 mb-12">
                            <button className="flex-1 border border-white/10 bg-white/5 text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-white hover:text-black transition-all">
                                Add to Cart
                            </button>
                            <button className="p-4 border border-white/10 bg-white/5 text-white rounded-sm hover:bg-white hover:text-black transition-all">
                                <RefreshCcw className="w-5 h-5" />
                            </button>
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
            </div>

            <Footer />
            <Dock />
        </main>
    );
}
