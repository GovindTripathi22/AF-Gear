"use client";

import { motion } from "framer-motion";
import { SPORTS } from "@/lib/kit-builder-config";
import Link from "next/link";
import { ArrowRight, Palette, Layers, Shirt } from "lucide-react";

export default function KitBuilderPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">

            {/* Hero */}
            <section className="relative pt-36 pb-16 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative max-w-4xl mx-auto text-center"
                >
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-5 py-2 rounded-full mb-6 border border-primary/20">
                        Custom Teamwear
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-[0.9] mb-4">
                        Kit <span className="text-primary">Builder</span>
                    </h1>
                    <p className="text-lg text-muted max-w-xl mx-auto mb-3">
                        Choose your sport, design your kit, and order — all in one place.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-xs text-white/50 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Full Colour Range</span>
                        <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Custom Patterns</span>
                        <span className="flex items-center gap-2"><Shirt className="w-4 h-4 text-primary" /> Kids & Adults</span>
                    </div>
                </motion.div>
            </section>

            {/* Breadcrumb */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-6">
                <div className="flex items-center gap-2 text-sm text-muted">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-primary font-bold">Kit Builder</span>
                    <span>/</span>
                    <span className="text-white">Select a Kit</span>
                </div>
            </div>

            {/* Sport Grid */}
            <section className="px-4 md:px-8 pb-24">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SPORTS.map((sport, i) => (
                            <motion.div
                                key={sport.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                            >
                                <Link
                                    href={`/kit-builder/${sport.id}`}
                                    className={`block group relative bg-gradient-to-br ${sport.bgGradient} border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(102,187,106,0.15)]`}
                                >
                                    {/* Content */}
                                    <div className="relative p-8 md:p-10 min-h-[280px] flex flex-col justify-between">
                                        {/* Top: Emoji + Sport Name */}
                                        <div>
                                            <span className="text-5xl md:text-6xl block mb-4 group-hover:scale-110 transition-transform duration-500">{sport.emoji}</span>
                                            <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
                                                {sport.name}
                                            </h2>
                                            <p className="text-sm text-muted leading-relaxed">{sport.subtitle}</p>
                                        </div>

                                        {/* Bottom: Stats */}
                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                <span>{sport.garments.length} garments</span>
                                                <span>{sport.patterns.length} patterns</span>
                                                <span>{sport.fabrics.length} fabrics</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300">
                                                <ArrowRight className="w-4 h-4 text-primary group-hover:text-black transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Info Bar */}
            <section className="px-4 md:px-8 pb-24">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { title: "Design Online", desc: "Choose colours, patterns, crests, names, and numbers — all from your browser." },
                            { title: "Quote in 24h", desc: "Our team reviews your design. We'll confirm pricing and delivery within 24 hours." },
                            { title: "Premium Quality", desc: "Sublimated prints that won't fade. Reinforced seams. Built for real sport." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-lg font-black text-primary">
                                    {i + 1}
                                </div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-2">{item.title}</h3>
                                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </main>
    );
}
