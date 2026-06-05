"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    Search,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowRight,
    MapPin,
    Calendar,
    ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Suspense } from "react";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get("id") || "";

    const [orderId, setOrderId] = useState(initialId);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderData = async (idToTrack: string) => {
        if (!idToTrack.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const supabase = createClient();

            const query = idToTrack.length > 20
                ? supabase.from("orders").select("*").eq("order_reference", idToTrack).single()
                : supabase.from("orders").select("*").ilike("order_reference", `%${idToTrack}`).single();

            const { data, fetchError } = await query;

            if (fetchError || !data) {
                setError("Order not found. Please check your Order ID and try again.");
            } else {
                setOrder(data);
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialId) {
            fetchOrderData(initialId);
        }
    }, [initialId]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrderData(orderId);

    };

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: Clock },
        { key: 'processing', label: 'Processing', icon: Package },
        { key: 'shipped', label: 'Shipped', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    const getCurrentStepIndex = () => {
        if (!order) return -1;
        return statusSteps.findIndex(step => step.key === order.status);
    };

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase mb-4 tracking-tight">
                        Track Your <span className="text-primary">Order</span>
                    </h1>
                    <p className="text-muted max-w-lg mx-auto">
                        Enter your Order ID (from your confirmation email) to see the live status of your custom gear.
                    </p>
                </div>

                {/* Track Search Box */}
                <div className="bg-background-elevated border border-white/5 p-2 rounded-2xl shadow-2xl mb-12 max-w-xl mx-auto flex items-center gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="text"
                            placeholder="Order ID (e.g. order_...)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-white pl-12 py-4"
                        />
                    </div>
                    <button
                        onClick={handleTrack}
                        disabled={loading}
                        className="bg-primary text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {loading ? "Searching..." : <>Track <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 justify-center mb-8"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}

                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Tracking Visual */}
                            <div className="bg-background-card border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ShoppingBag className="w-40 h-40 text-white" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                        <div>
                                            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 block">Current Status</span>
                                            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                                                {statusSteps[getCurrentStepIndex()]?.label || order.status}
                                            </h2>
                                        </div>
                                        <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
                                            <span className="text-xs text-muted font-bold uppercase tracking-widest">ID: {order.order_reference.slice(-12)}</span>
                                        </div>
                                    </div>

                                    {/* Stepper */}
                                    <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 mb-12">
                                        {/* Connector Line (Desktop) */}
                                        <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-white/10 -z-0" />

                                        {statusSteps.map((step, index) => {
                                            const isDone = index <= getCurrentStepIndex();
                                            const isActive = index === getCurrentStepIndex();
                                            const Icon = step.icon;

                                            return (
                                                <div key={step.key} className="relative z-10 flex md:flex-col items-center gap-4 md:text-center flex-1">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isDone
                                                        ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(102,187,106,0.4)]'
                                                        : 'bg-background-elevated border-white/10 text-white/20'
                                                        }`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-bold uppercase tracking-widest ${isDone ? 'text-white' : 'text-white/20'}`}>
                                                            {step.label}
                                                        </span>
                                                        {isActive && <span className="text-[10px] text-primary font-bold animate-pulse">Now</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                                    </h3>
                                    <div className="text-muted text-sm space-y-1">
                                        <p className="text-white font-medium">{order.shipping_address?.name}</p>
                                        <p>{order.shipping_address?.address?.line1}</p>
                                        <p>{order.shipping_address?.address?.city}, {order.shipping_address?.address?.postal_code}</p>
                                        <p className="uppercase">{order.shipping_address?.address?.country}</p>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" /> Order Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Placed on:</span>
                                            <span className="text-white font-medium">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Total Paid:</span>
                                            <span className="text-white font-black">€{Number(order.amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
