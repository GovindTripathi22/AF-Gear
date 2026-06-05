"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { ChevronRight, ArrowRight, ShieldCheck, Truck, Package, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { items, total, isLoaded, clearCart } = useCart();
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

    // Redirect empty carts, but only AFTER hydration is complete and not currently redirecting
    useEffect(() => {
        if (isLoaded && items.length === 0 && !isRedirecting) {
            router.push("/"); // Back to home if the cart is legitimately empty
        }
    }, [items, isLoaded, router, isRedirecting]);

    const shippingCost = shippingMethod === "standard" ? 5.99 : 14.99;
    const finalTotal = total + shippingCost;

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "IE",
    });

    // Populate Clerk user info if logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: prev.email || user.emailAddresses[0]?.emailAddress || "",
                firstName: prev.firstName || user.firstName || "",
                lastName: prev.lastName || user.lastName || "",
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    customerEmail: formData.email,
                    shippingMethod,
                    shippingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                    }
                }),
            });

            const data = await response.json();

            if (data.url) {
                setIsRedirecting(true);
                clearCart();
                window.location.href = data.url;
            } else {
                console.error("Checkout Error:", data.error);
                toast.error(data.error || "Something went wrong with checkout.");
            }
        } catch (error) {
            console.error("Checkout Request Failed:", error);
            toast.error("Failed to connect to checkout server.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded || items.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-muted mb-8">
                    <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white font-medium">Checkout</span>
                </nav>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                    {/* Left Column: Checkout Form */}
                    <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            onSubmit={handleCheckout}
                            className="space-y-12"
                        >
                            {/* Contact Information */}
                            <section>
                                <h2 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">1</span>
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Email Address"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Email Address
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section>
                                <h2 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">2</span>
                                    Shipping Details
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="First Name"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            First Name
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Last Name"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Last Name
                                        </label>
                                    </div>
                                    <div className="col-span-2 relative group">
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Address"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Address
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="City"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            City
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="postalCode"
                                            required
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Postal Code"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Postal/Zip Code
                                        </label>
                                    </div>
                                    <div className="col-span-2 relative group">
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                        >
                                            <option value="IE">Ireland</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="US">United States</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                        <label className="absolute text-muted text-sm left-4 top-1 origin-[0] scale-75 transition-all">
                                            Country
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Method */}
                            <section>
                                <h2 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">3</span>
                                    Shipping Method
                                </h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${shippingMethod === 'standard' ? 'bg-primary/5 border-primary' : 'bg-black/50 border-white/10 hover:border-white/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'standard' ? 'border-primary' : 'border-white/30'}`}>
                                                {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Standard Delivery</p>
                                                <p className="text-sm text-muted">3-5 Business Days</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-white">€5.99</span>
                                        <input type="radio" name="shippingMethod" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="sr-only" />
                                    </label>

                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${shippingMethod === 'express' ? 'bg-primary/5 border-primary' : 'bg-black/50 border-white/10 hover:border-white/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'express' ? 'border-primary' : 'border-white/30'}`}>
                                                {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white flex items-center gap-2">
                                                    Express Delivery
                                                    <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Next Day</span>
                                                </p>
                                                <p className="text-sm text-muted">Orders before 1pm</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-white">€14.99</span>
                                        <input type="radio" name="shippingMethod" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="sr-only" />
                                    </label>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-black transition-all duration-300 bg-primary rounded-xl overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                <span className="relative flex items-center justify-center gap-2 uppercase tracking-wide">
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Place Order via WhatsApp
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </motion.form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 lg:sticky lg:top-24 backdrop-blur-xl"
                        >
                            <h2 className="text-xl font-display font-black text-white uppercase mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                        <div className="relative w-16 h-20 bg-black/40 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                                                </div>
                                            )}
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#111]">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 py-1">
                                            <h4 className="text-white font-medium text-sm line-clamp-1">{item.title}</h4>
                                            <p className="text-muted text-xs mt-1">Size: {item.size}</p>
                                            <p className="text-primary font-medium text-sm mt-1">
                                                €{((typeof item.price === "number" ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, ""))) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals Calculation */}
                            <div className="space-y-3 pt-6 border-t border-white/10 mb-6">
                                <div className="flex justify-between text-muted text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-white">€{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted text-sm items-center">
                                    <span>Shipping</span>
                                    <span className="text-white">€{shippingCost.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-6 border-t border-white/10 mb-8">
                                <div>
                                    <span className="text-white font-display font-black uppercase tracking-wider block">Total</span>
                                    <span className="text-xs text-muted">Including VAT</span>
                                </div>
                                <span className="text-3xl font-bold text-primary">€{finalTotal.toFixed(2)}</span>
                            </div>

                            {/* Trust Signals */}
                            <div className="space-y-3 p-4 bg-black/40 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3 text-sm text-muted">
                                    <ShieldCheck className="w-4 h-4 text-green-400" />
                                    <span>Secure 256-bit SSL encryption.</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted">
                                    <RotateCcw className="w-4 h-4 text-blue-400" />
                                    <span>30-Day returns policy.</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
