"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SPORTS } from "@/lib/kit-builder-config";
import { ArrowRight, Palette, Layers, Shirt } from "lucide-react";

export function KitBuilderSection() {
    return (
        <section className="relative py-20 px-4 md:px-8 overflow-hidden bg-background">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/6 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-[1200px] mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-5 py-2 rounded-full mb-4 border border-primary/20">
                        Custom Teamwear
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase leading-tight mb-3">
                        Kit <span className="text-primary">Builder</span>
                    </h2>
                    <p className="text-muted max-w-lg mx-auto">
                        Design your team&apos;s kit from scratch. Choose your sport, pick garments, customise colours, add crests and sponsors.
                    </p>
                </motion.div>

                {/* Sport Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-10">
                    {SPORTS.map((sport, i) => (
                        <motion.div
                            key={sport.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                        >
                            <Link
                                href={`/kit-builder/${sport.id}`}
                                className="block group bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 text-center hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                            >
                                <span className="text-3xl md:text-4xl block mb-2 group-hover:scale-110 transition-transform">{sport.emoji}</span>
                                <p className="text-white font-bold text-xs md:text-sm uppercase tracking-wide group-hover:text-primary transition-colors">{sport.name}</p>
                                <p className="text-muted text-[10px] mt-1">{sport.garments.length} items</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Features Bar */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-xs text-white/40 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> 18+ Colours</span>
                    <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Custom Patterns</span>
                    <span className="flex items-center gap-2"><Shirt className="w-4 h-4 text-primary" /> Kids & Adults</span>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/kit-builder"
                        className="inline-flex items-center gap-2 bg-primary text-black font-black uppercase tracking-[0.15em] px-8 py-4 rounded-sm hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)] transition-all"
                    >
                        Start Building <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
