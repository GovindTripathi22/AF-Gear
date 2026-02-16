"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SHOP_COLLECTIONS = [
    { name: "Club Teamwear", href: "#club", count: 8 },
    { name: "Limerick Collection", href: "#limerick", count: 8 },
    { name: "Tipperary Collection", href: "#tipperary", count: 8 },
    { name: "Irish Language Range", href: "#irish", count: 8 },
    { name: "School Uniforms", href: "/school-uniforms", count: 12 },
];

export function FeaturedShop() {
    return (
        <section className="relative py-24 bg-background border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                        Browse Our Store
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
                        Shop by <span className="text-primary">Collection</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                    {/* Left Sidebar — Collection Links */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-3"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-8 pb-4 border-b border-white/10">
                            Collections
                        </h3>
                        <ul className="space-y-1">
                            {SHOP_COLLECTIONS.map((collection, i) => (
                                <li key={collection.name}>
                                    <a
                                        href={collection.href}
                                        className="group flex items-center justify-between py-3 px-4 rounded-sm text-muted hover:text-white hover:bg-white/5 transition-all duration-300"
                                    >
                                        <span className="text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                                            {collection.name}
                                        </span>
                                        <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {collection.count}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12 p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-sm">
                            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Custom Orders</p>
                            <p className="text-sm text-muted leading-relaxed mb-4">
                                Need custom jerseys for your school or club? Get in touch.
                            </p>
                            <a href="/contact" className="text-xs font-bold uppercase tracking-widest text-white hover:text-primary transition-colors flex items-center gap-2">
                                Contact Us <ArrowRight className="w-3 h-3" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Right — Featured Product Display */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-9"
                    >
                        <div className="relative bg-background-elevated rounded-sm overflow-hidden border border-white/5 group">
                            {/* Large Product Showcase */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                {/* Front View */}
                                <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                                    <img
                                        src="/assets/1000030808.png"
                                        alt="Club Elite Home Jersey - Front"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute bottom-6 left-6 z-10">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            Front View
                                        </span>
                                    </div>
                                </div>
                                {/* Back View */}
                                <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]">
                                    <img
                                        src="/assets/1000030809.png"
                                        alt="Club Elite Away Jersey - Back"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute bottom-6 left-6 z-10">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            Back View
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info Bar */}
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/5">
                                <div>
                                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Featured Collection</p>
                                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                                        Club Elite Series
                                    </h3>
                                    <p className="text-muted text-sm mt-2">Premium match-day jerseys with breathable performance fabric.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-price">From €54.99</span>
                                    <a href="/collections/club" className="bg-primary text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:scale-105 hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all duration-300 rounded-sm flex items-center gap-2">
                                        Shop Now <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Logo Watermark */}
                            <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none">
                                <img src="/assets/af-logo.png" alt="" className="w-24 h-auto" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
