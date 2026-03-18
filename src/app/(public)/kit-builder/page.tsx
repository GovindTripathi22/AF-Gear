"use client";

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
<<<<<<< HEAD
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                href={`/kit-builder/${sport.id}`}
                className="group relative block rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-500 active:scale-[0.98]"
            >
                {/* Card Content */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
=======
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                href={`/kit-builder/${sport.id}`}
                className="group relative block rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-500"
            >
                {/* Card Content */}
                <div className="relative aspect-[3/4] overflow-hidden">
>>>>>>> target/main
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
<<<<<<< HEAD
                            {getSportIcon(sport.id, "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 text-white/10 group-hover:text-primary/40 transition-colors duration-500")}
=======
                            {getSportIcon(sport.id, "w-20 h-20 md:w-28 md:h-28 text-white/10 group-hover:text-primary/40 transition-colors duration-500")}
>>>>>>> target/main
                        </div>
                    )}

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Hover Neon Edge */}
                    <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/20 group-hover:shadow-[inset_0_0_30px_rgba(102,187,106,0.05)] transition-all duration-500" />

                    {/* Content Overlay */}
<<<<<<< HEAD
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
                        {/* Sport Icon Badge */}
                        <div className="mb-2 sm:mb-3 flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                                {getSportIcon(sport.id, "w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 group-hover:text-primary transition-colors")}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-primary/60 transition-colors">
=======
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        {/* Sport Icon Badge */}
                        <div className="mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                                {getSportIcon(sport.id, "w-4 h-4 text-white/60 group-hover:text-primary transition-colors")}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-primary/60 transition-colors">
>>>>>>> target/main
                                {sport.garments.length} items
                            </span>
                        </div>

                        {/* Title */}
<<<<<<< HEAD
                        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider leading-tight group-hover:text-primary transition-colors duration-300">
                            {sport.name}
                        </h2>
                        <p className="text-white/30 text-[11px] sm:text-xs mt-1 line-clamp-1 group-hover:text-white/50 transition-colors">
=======
                        <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider leading-tight group-hover:text-primary transition-colors duration-300">
                            {sport.name}
                        </h2>
                        <p className="text-white/30 text-xs mt-1 line-clamp-1 group-hover:text-white/50 transition-colors">
>>>>>>> target/main
                            {sport.subtitle}
                        </p>

                        {/* CTA Arrow */}
<<<<<<< HEAD
                        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-all duration-300">
                            <span>Get a Quote</span>
=======
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-all duration-300">
                            <span>Design Now</span>
>>>>>>> target/main
                            <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Top Right Badge */}
<<<<<<< HEAD
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <div className="bg-primary/90 backdrop-blur-md text-black px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-[0_0_20px_rgba(102,187,106,0.3)]">
                            Inquire
=======
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <div className="bg-primary/90 backdrop-blur-md text-black px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-[0_0_20px_rgba(102,187,106,0.3)]">
                            Build Kit
>>>>>>> target/main
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
<<<<<<< HEAD
            <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 md:px-8 overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] bg-primary/[0.04] blur-[150px] rounded-full pointer-events-none" />
=======
            <section className="relative pt-32 pb-16 px-4 md:px-8 overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.04] blur-[150px] rounded-full pointer-events-none" />
>>>>>>> target/main

                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
<<<<<<< HEAD
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
=======
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70 bg-primary/[0.08] border border-primary/15 px-5 py-2 rounded-full mb-6 backdrop-blur-sm">
                            <Sparkles className="w-3 h-3" />
                            Custom Teamwear Studio
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase leading-[0.9] tracking-tight">
                            Design Your
                            <br />
                            <span className="text-primary">Perfect Kit</span>
                        </h1>
                        <p className="text-white/30 text-sm md:text-base max-w-md mx-auto mt-4 leading-relaxed">
                            Choose your sport. Pick your colours. Build something legendary.
>>>>>>> target/main
                        </p>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
<<<<<<< HEAD
                        className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mt-6 sm:mt-8"
=======
                        className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mt-8"
>>>>>>> target/main
                    />
                </div>
            </section>

            {/* Sport Selection Grid */}
<<<<<<< HEAD
            <section className="px-4 md:px-8 pb-20 sm:pb-24">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
=======
            <section className="px-4 md:px-8 pb-24">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
>>>>>>> target/main
                        {SPORTS.map((sport, i) => (
                            <SportCard key={sport.id} sport={sport} index={i} />
                        ))}
                    </div>

<<<<<<< HEAD
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
=======
                    {/* Coming Soon Card */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: SPORTS.length * 0.12 + 0.2 }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full px-6 py-3">
                            <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">
>>>>>>> target/main
                                More Sports Coming Soon
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
