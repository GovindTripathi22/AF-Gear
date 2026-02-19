"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (sessionId) {
            clearCart();
        }
    }, [sessionId, clearCart]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-background-elevated border border-white/10 rounded-2xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-display font-black text-white uppercase mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-muted text-sm mb-8">
                        Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
                    </p>

                    <div className="w-full bg-white/5 rounded-lg p-4 mb-8 border border-white/5">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted">Order ID:</span>
                            <span className="text-white font-mono">{sessionId?.slice(-8) || "Processing..."}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted">Status:</span>
                            <span className="text-primary font-bold">Paid</span>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                        <Link
                            href="/#shop"
                            className="w-full bg-primary text-black font-bold uppercase tracking-widest py-4 rounded-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
                        >
                            Continue Shopping <ShoppingBag className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/"
                            className="w-full bg-white/5 text-white font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            Back to Home <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
