"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SPORTS } from "@/lib/query-form-config";
import { ArrowRight, Palette, Layers, Shirt, Shield, Trophy, Activity, Target, Flame, Zap } from "lucide-react";

export const getSportIcon = (id: string, className: string) => {
    switch (id) {
        case "field-sports": return <Shield className={className} />;
        case "lgfa-camogie": return <Activity className={className} />;
        case "soccer": return <Target className={className} />;
        case "rugby": return <Trophy className={className} />;
        case "basketball": return <Flame className={className} />;
        case "athletics": return <Zap className={className} />;
        default: return <Shirt className={className} />;
    }
};

export function QueryFormSection() {
    return (
        <section className="relative py-14 sm:py-20 px-4 md:px-8 overflow-hidden bg-background">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-primary/6 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-[1200px] mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary bg-primary/10 px-4 sm:px-5 py-2 rounded-full mb-3 sm:mb-4 border border-primary/20">
                        Custom Teamwear
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase leading-tight mb-2 sm:mb-3">
                        Query <span className="text-primary">Form</span>
                    </h2>
                    <p className="text-muted text-xs sm:text-sm md:text-base max-w-lg mx-auto px-4">
                        Get a custom kit for your team. Choose your sport, tell us your requirements, and we&apos;ll handle the rest.
                    </p>
                </motion.div>

                {/* Sport Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 mb-8 sm:mb-10 w-full max-w-sm sm:max-w-none mx-auto">
                    {SPORTS.map((sport, i) => (
                        <motion.div
                            key={sport.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                        >
                            <Link
                                href={`/query-form/${sport.id}`}
                                className="block relative group bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 md:p-5 text-center transition-all duration-300 overflow-hidden hover:border-primary/40 active:scale-[0.97]"
                            >
                                {/* Glowing Hover Background */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <motion.div
                                        className="mb-2 sm:mb-3 text-white/70 group-hover:text-primary transition-colors duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_15px_rgba(102,187,106,0.4)]"
                                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {getSportIcon(sport.id, "w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11")}
                                    </motion.div>
                                    <p className="text-white font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wide group-hover:text-primary transition-colors">{sport.name}</p>
                                    <p className="text-muted text-[9px] sm:text-[10px] mt-0.5 sm:mt-1">{sport.garments.length} items</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Features Bar */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 sm:gap-2"><Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /> 18+ Colours</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /> Custom Patterns</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /> Kids & Adults</span>
                </div>

                {/* CTA */}
                <div className="text-center px-4 sm:px-0">
                    <Link
                        href="/query-form"
                        className="inline-flex items-center gap-2 bg-primary text-black font-black uppercase tracking-[0.15em] px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)] transition-all text-sm sm:text-base active:scale-[0.98] min-h-[48px]"
                    >
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
