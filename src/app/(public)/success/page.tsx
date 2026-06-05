"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ShoppingBag, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
    const searchParams = useSearchParams();
    const whatsappUrl = searchParams.get("url");
    const orderRef = searchParams.get("ref") || "Processing...";
    const { clearCart } = useCart();
    const [mounted, setMounted] = useState(false);
    const [attemptedRedirect, setAttemptedRedirect] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Ensure cart is fully cleared when landing on success page
        clearCart();

        if (whatsappUrl && !attemptedRedirect) {
            setAttemptedRedirect(true);
            // Attempt automatic redirect to WhatsApp
            const timer = setTimeout(() => {
                window.location.href = whatsappUrl;
            }, 800); // Small delay so they see the success screen first
            return () => clearTimeout(timer);
        }
    }, [whatsappUrl, attemptedRedirect, clearCart]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-display font-black text-white uppercase mb-2">
                        Order Received!
                    </h1>
                    <p className="text-muted text-sm mb-6">
                        Your order details have been recorded. To complete your order, please send the summary to the shop owner via WhatsApp.
                    </p>

                    {/* Order Reference Box */}
                    <div className="w-full bg-white/5 rounded-lg p-4 mb-6 border border-white/5 text-left">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted">Order Reference:</span>
                            <span className="text-white font-mono font-bold">{orderRef}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted">Checkout Method:</span>
                            <span className="text-primary font-bold">WhatsApp Direct</span>
                        </div>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="flex flex-col w-full gap-3">
                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                className="w-full bg-primary text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(102,187,106,0.2)]"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Send via WhatsApp
                            </a>
                        )}
                        <Link
                            href="/products"
                            className="w-full bg-white/5 text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Continue Shopping <ShoppingBag className="w-4 h-4" />
                        </Link>
                    </div>

                    {whatsappUrl && (
                        <p className="text-[11px] text-muted mt-4">
                            If WhatsApp didn&apos;t open automatically, click the button above.
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
