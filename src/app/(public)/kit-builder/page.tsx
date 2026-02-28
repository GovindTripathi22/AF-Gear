"use client";

<<<<<<< HEAD
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
=======
import { useState } from "react";
import { motion } from "framer-motion";
import { SPORTS } from "@/lib/kit-builder-config";
import type { SportConfig } from "@/lib/kit-builder-config";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getSportIcon } from "@/components/products/KitBuilderSection";

function SportCard({ sport, index }: { sport: SportConfig; index: number }) {
    const [imgFailed, setImgFailed] = useState(false);
    const showImage = sport.image && !imgFailed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                href={`/kit-builder/${sport.id}`}
                className="group relative block rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-500 active:scale-[0.98]"
            >
                {/* Card Content */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Sport Image */}
                    {showImage ? (
                        <img
                            src={sport.image}
                            alt={sport.name}
                            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                            onError={() => setImgFailed(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent">
                            {getSportIcon(sport.id, "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 text-white/10 group-hover:text-primary/40 transition-colors duration-500")}
                        </div>
                    )}

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Hover Neon Edge */}
                    <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/20 group-hover:shadow-[inset_0_0_30px_rgba(102,187,106,0.05)] transition-all duration-500" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
                        {/* Sport Icon Badge */}
                        <div className="mb-2 sm:mb-3 flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                                {getSportIcon(sport.id, "w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 group-hover:text-primary transition-colors")}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-primary/60 transition-colors">
                                {sport.garments.length} items
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider leading-tight group-hover:text-primary transition-colors duration-300">
                            {sport.name}
                        </h2>
                        <p className="text-white/30 text-[11px] sm:text-xs mt-1 line-clamp-1 group-hover:text-white/50 transition-colors">
                            {sport.subtitle}
                        </p>

                        {/* CTA Arrow */}
                        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-all duration-300">
                            <span>Get a Quote</span>
                            <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Top Right Badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <div className="bg-primary/90 backdrop-blur-md text-black px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-[0_0_20px_rgba(102,187,106,0.3)]">
                            Inquire
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function KitBuilderPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Hero Section */}
            <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 md:px-8 overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] bg-primary/[0.04] blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary/70 bg-primary/[0.08] border border-primary/15 px-4 sm:px-5 py-2 rounded-full mb-5 sm:mb-6 backdrop-blur-sm">
                            <Sparkles className="w-3 h-3" />
                            Custom Teamwear
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase leading-[0.9] tracking-tight">
                            Get Your
                            <br />
                            <span className="text-primary">Perfect Kit</span>
                        </h1>
                        <p className="text-white/30 text-xs sm:text-sm md:text-base max-w-md mx-auto mt-3 sm:mt-4 leading-relaxed px-4">
                            Choose your sport and submit an inquiry. Our team will design a kit you&apos;ll love.
                        </p>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mt-6 sm:mt-8"
                    />
                </div>
            </section>

            {/* Sport Selection Grid */}
            <section className="px-4 md:px-8 pb-20 sm:pb-24">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {SPORTS.map((sport, i) => (
                            <SportCard key={sport.id} sport={sport} index={i} />
                        ))}
                    </div>

                    {/* Coming Soon */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: SPORTS.length * 0.1 + 0.2 }}
                        className="mt-10 sm:mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full px-5 sm:px-6 py-2.5 sm:py-3">
                            <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">
                                More Sports Coming Soon
                            </span>
                        </div>
                    </motion.div>
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
                </div>
            </section>
        </main>
    );
}
