"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CartDrawer() {
    const { items, removeFromCart, updateQuantity, total, isOpen, setIsOpen } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-background-card border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-display font-black text-white uppercase flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                Your Cart <span className="text-primary">({items.length})</span>
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <ShoppingBag className="w-16 h-16 text-white/10" />
                                    <p className="text-muted font-medium">Your cart is empty.</p>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-primary font-bold uppercase tracking-widest text-xs hover:underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-24 bg-background-elevated rounded-sm overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-bold text-white uppercase line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size)}
                                                        className="text-white/30 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted font-medium mt-1">Size: {item.size}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-price">{item.price}</p>

                                                {/* Quantity */}
                                                <div className="flex items-center border border-white/10 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                        className="p-1 px-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="p-1 px-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-background-elevated space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="font-bold text-white text-lg">€{total.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] text-muted text-center uppercase tracking-widest">
                                    Shipping & taxes calculated at checkout
                                </p>
                                <button className="w-full bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all py-4 rounded-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(102,187,106,0.3)]">
                                    Checkout Now <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
