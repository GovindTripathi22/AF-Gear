"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, CreditCard } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface Product {
    id: number;
    title: string;
    price: string;
    image?: string;
    category: string;
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [size, setSize] = useState("M");
    const [sizeType, setSizeType] = useState("Adults");
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart } = useCart();

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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="bg-background-card border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl flex flex-col md:flex-row relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 bg-background-elevated aspect-square md:aspect-auto relative">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-muted">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                                <span className="text-sm font-bold tracking-widest text-primary uppercase mb-2">
                                    {product.category}
                                </span>
                                <h2 className="text-3xl font-display font-black text-white uppercase leading-none mb-4">
                                    {product.title}
                                </h2>
                                <p className="text-2xl font-bold text-price mb-6">
                                    {product.price}
                                </p>

                                <p className="text-muted leading-relaxed mb-8">
                                    Premium performance fabric designed for elite athletes.
                                    Breathable, durable, and built to handle the intensity of the game.
                                </p>

                                {/* Size Selector */}
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">
                                        Select Size
                                    </h3>
                                    {/* Size Type Toggle */}
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
                                </div>

                                {/* Actions */}
                                <div className="mt-auto space-y-4">
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
                                    <button className="w-full bg-[#81C784] text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 py-4 rounded-sm">
                                        <CreditCard className="w-4 h-4" />
                                        Buy it Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
