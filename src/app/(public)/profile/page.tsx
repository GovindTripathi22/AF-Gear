"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowLeft, Clock, Play, Mail, Calendar, Settings, Package, ArrowRight, Truck, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [designs, setDesigns] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingDesigns, setLoadingDesigns] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            if (!isLoaded || !isSignedIn || !user) {
                if (isLoaded && !isSignedIn) {
                    setLoadingDesigns(false);
                    setLoadingOrders(false);
                }
                return;
            }

            try {
                const supabase = createClient();
                const [designsRes, ordersRes] = await Promise.all([
                    supabase
                        .from("saved_designs")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false }),
                    supabase
                        .from("orders")
                        .select("*")
                        .eq("customer_email", user.primaryEmailAddress?.emailAddress)
                        .order("created_at", { ascending: false })
                ]);

                if (designsRes.error) throw designsRes.error;
                if (designsRes.data) setDesigns(designsRes.data);

                if (ordersRes.error) throw ordersRes.error;
                if (ordersRes.data) setOrders(ordersRes.data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            } finally {
                setLoadingDesigns(false);
                setLoadingOrders(false);
            }
        }

        fetchUserData();
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-display font-black text-white uppercase mb-4">Access Denied</h1>
                <p className="text-muted mb-8 text-center max-w-md">You need to be signed in to view your profile and saved designs.</p>
                <Link href="/" className="bg-primary text-black font-bold uppercase text-xs tracking-widest px-8 py-3 rounded hover:bg-primary/90 transition-colors">
                    Back to Home
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* User Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/20 p-2 relative z-10">
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20" />
                    </div>

                    {/* User Details */}
                    <div className="flex-grow text-center md:text-left relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-white tracking-tight mb-2">
                                    {user.firstName} <span className="text-primary">{user.lastName}</span>
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-primary/50" />
                                        <span>{user.primaryEmailAddress?.emailAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-primary/50" />
                                        <span>Joined {format(new Date(user.createdAt!), "MMMM yyyy")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {orders.length} Orders
                                </span>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    {designs.length} Saved Designs
                                </span>
                            </div>
                            <Link
                                href="/kit-builder"
                                className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 px-4 py-2"
                            >
                                <Settings className="w-4 h-4" /> Edit Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* My Orders Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                        <h2 className="text-xl font-display font-black uppercase tracking-tight text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            My Orders
                        </h2>
                    </div>

                    {loadingOrders ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
                                    {/* Order Info */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-bold text-white uppercase tracking-widest">
                                                Order from {format(new Date(order.created_at), "MMM d, yyyy")}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    order.status === 'shipped' ? 'bg-primary/10 text-primary border-primary/20' :
                                                        'bg-white/5 text-white/70 border-white/10'
                                                }`}>
                                                {order.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                                                {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                                                {order.status !== 'delivered' && order.status !== 'shipped' && <Package className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted">
                                            {order.items?.length || 0} items • <span className="text-white font-bold">€{Number(order.total_amount).toFixed(2)}</span>
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <div className="shrink-0 flex items-center gap-3">
                                        <Link
                                            href={`/track-order?id=${order.stripe_session_id}`}
                                            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black font-bold uppercase tracking-widest px-6 py-3 rounded text-xs transition-colors flex items-center gap-2"
                                        >
                                            Track Order <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
                            <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
<<<<<<< HEAD
                            <p className="text-muted text-lg mb-4">You haven&apos;t placed any orders yet.</p>
=======
                            <p className="text-muted text-lg mb-4">You haven't placed any orders yet.</p>
>>>>>>> target/main
                            <Link
                                href="/#shop"
                                className="inline-block bg-primary text-black font-bold uppercase text-xs tracking-widest px-8 py-4 rounded hover:brightness-110 transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                        <h2 className="text-xl font-display font-black uppercase tracking-tight text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            Saved Designs
                        </h2>
                    </div>

                    {loadingDesigns ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </div>
                    ) : designs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {designs.map((design) => (
                                <div key={design.id} className="bg-background-card border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors group">
                                    <h3 className="text-xl font-bold text-white mb-2">{design.design_name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted font-bold uppercase tracking-widest mb-6">
                                        <span>{design.sport_id.replace("-", " ")}</span>
                                        <span>•</span>
                                        <Clock className="w-3 h-3" />
                                        <span>{formatDistanceToNow(new Date(design.created_at), { addSuffix: true })}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 px-2 py-1 rounded">
                                            Pattern: {design.settings?.pattern || "solid"}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 px-2 py-1 rounded">
                                            Colors: {Object.keys(design.settings?.colors || {}).length}
                                        </span>
                                    </div>

                                    {/* Link to kit builder (Ideally this would serialize settings back to state) */}
                                    <Link
                                        href={`/kit-builder/${design.sport_id}`}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest py-3 rounded flex items-center justify-center gap-2 transition-colors group-hover:bg-primary group-hover:text-black"
                                    >
                                        <Play className="w-4 h-4" /> Load Design
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-background-elevated rounded-xl border border-white/5">
<<<<<<< HEAD
                            <p className="text-muted text-lg mb-4">You haven&apos;t saved any designs yet.</p>
=======
                            <p className="text-muted text-lg mb-4">You haven't saved any designs yet.</p>
>>>>>>> target/main
                            <Link
                                href="/kit-builder"
                                className="inline-block bg-primary text-black font-bold uppercase text-xs tracking-widest px-8 py-4 rounded hover:bg-primary/90 transition-colors"
                            >
                                Start Building
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
