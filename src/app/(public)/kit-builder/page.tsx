"use client";

import { motion } from "framer-motion";
import { SPORTS } from "@/lib/kit-builder-config";
import Link from "next/link";
import { ArrowRight, Palette, Layers, Shirt } from "lucide-react";

export default function KitBuilderPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black pt-32 pb-24">

            {/* Header / Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-sm md:text-base tracking-widest uppercase mb-4"
                >
                    <Link href="/kit-builder" className="text-white/40 hover:text-primary transition-colors">Kit Builder</Link>
                    <span className="text-white/20">/</span>
                    <span className="text-white font-black">Select a kit</span>
                </motion.div>

                <div className="h-[2px] w-24 bg-primary/30 mx-auto mt-4" />
            </div>

            {/* Selection Grid */}
            <section className="px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-8">
                        {SPORTS.map((sport, i) => (
                            <motion.div
                                key={sport.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative group"
                            >
                                <Link href={`/kit-builder/${sport.id}`} className="block">
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] mb-8 overflow-visible flex items-center justify-center">
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                                        {/* Athlete Image (Placeholder if not available) */}
                                        <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-4">
                                            {sport.image ? (
                                                <img
                                                    src={sport.image}
                                                    alt={sport.name}
                                                    className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                                    onError={(e) => {
                                                        // Fallback to Emoji if image fails
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-9xl group-hover:scale-110 transition-transform duration-500 select-none">${sport.emoji}</span>`;
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-9xl group-hover:scale-110 transition-transform duration-500 select-none">
                                                    {sport.emoji}
                                                </span>
                                            )}
                                        </div>

                                        {/* Floating Badge */}
                                        <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Build Now
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="text-center">
                                        <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                                            {sport.name}
                                        </h2>
                                        <div className="w-0 h-[2px] bg-primary mx-auto mt-2 group-hover:w-16 transition-all duration-300" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Special LIDL / Sponsor Selection */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: SPORTS.length * 0.1 }}
                            className="relative group cursor-not-allowed grayscale"
                        >
                            <div className="relative aspect-[3/4] mb-8 overflow-visible flex items-center justify-center">
                                <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl" />
                                <div className="relative w-full h-full p-12 flex items-center justify-center">
                                    <img
                                        src="/assets/1000030808.png"
                                        alt="Special Collection"
                                        className="w-full h-full object-contain rounded-2xl opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl md:text-2xl font-display font-black text-white/20 uppercase tracking-wider">
                                    SPECIAL COLLECTION
                                </h2>
                                <p className="text-[10px] text-white/10 uppercase tracking-[0.2em] mt-1 font-bold">Coming Soon</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
