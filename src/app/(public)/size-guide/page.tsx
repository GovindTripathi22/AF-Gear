"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, ShieldCheck, Ruler, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ADULT_SIZES = [
    { size: "XS", chestIn: "34 - 36", chestCm: "86 - 91", waistIn: "28 - 30", waistCm: "71 - 76" },
    { size: "S", chestIn: "36 - 38", chestCm: "91 - 96", waistIn: "30 - 32", waistCm: "76 - 81" },
    { size: "M", chestIn: "38 - 40", chestCm: "96 - 101", waistIn: "32 - 34", waistCm: "81 - 86" },
    { size: "L", chestIn: "40 - 42", chestCm: "101 - 106", waistIn: "34 - 36", waistCm: "86 - 91" },
    { size: "XL", chestIn: "42 - 44", chestCm: "106 - 111", waistIn: "36 - 38", waistCm: "91 - 96" },
    { size: "2XL", chestIn: "44 - 46", chestCm: "111 - 117", waistIn: "38 - 40", waistCm: "96 - 101" },
    { size: "3XL", chestIn: "46 - 48", chestCm: "117 - 122", waistIn: "40 - 42", waistCm: "101 - 106" },
    { size: "4XL", chestIn: "48 - 50", chestCm: "122 - 127", waistIn: "42 - 44", waistCm: "106 - 111" },
];

const KIDS_SIZES = [
    { size: "3-4Y", heightCm: "98 - 104", chestCm: "55 - 57", waistCm: "52 - 54" },
    { size: "5-6Y", heightCm: "110 - 116", chestCm: "59 - 61", waistCm: "55 - 57" },
    { size: "7-8Y", heightCm: "122 - 128", chestCm: "63 - 67", waistCm: "58 - 60" },
    { size: "9-10Y", heightCm: "134 - 140", chestCm: "69 - 73", waistCm: "61 - 64" },
    { size: "11-12Y", heightCm: "146 - 152", chestCm: "75 - 79", waistCm: "65 - 68" },
    { size: "13Y", heightCm: "158 - 164", chestCm: "82 - 86", waistCm: "70 - 73" },
];

export default function SizeGuidePage() {
    const [activeTab, setActiveTab] = useState<"adults" | "kids">("adults");

    return (
        <div className="min-h-screen bg-background pt-28 pb-20 relative selection:bg-primary selection:text-black">
            {/* Background Accent Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Navigation */}
                <nav className="flex items-center gap-2 text-sm text-muted mb-8">
                    <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white font-medium">Size Guide</span>
                </nav>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <Link href="/#shop" className="inline-flex items-center gap-2 text-primary hover:text-white text-sm font-bold uppercase tracking-widest transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Shop
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Ruler className="w-8 h-8 text-primary" />
                            Find Your Perfect Fit
                        </h1>
                        <p className="text-muted text-base max-w-xl mt-2">
                            Use our official sizing charts to determine the best fit for our premium performance apparel and teamwear.
                        </p>
                    </div>

                    {/* Selector Tabs */}
                    <div className="flex gap-2 bg-white/5 border border-white/10 p-1.5 rounded-full backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("adults")}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                activeTab === "adults"
                                    ? "bg-primary text-black shadow-lg"
                                    : "text-muted hover:text-white"
                            }`}
                        >
                            Adults (Unisex)
                        </button>
                        <button
                            onClick={() => setActiveTab("kids")}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                activeTab === "kids"
                                    ? "bg-primary text-black shadow-lg"
                                    : "text-muted hover:text-white"
                            }`}
                        >
                            Kids / Youth
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Sizing Tables Panel */}
                    <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-display font-black text-white uppercase mb-6 tracking-wide">
                            {activeTab === "adults" ? "Adult Sizing Reference" : "Kids Sizing Reference"}
                        </h2>

                        <div className="overflow-x-auto">
                            {activeTab === "adults" ? (
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-muted">
                                            <th className="pb-4">Size</th>
                                            <th className="pb-4">Chest (Inches)</th>
                                            <th className="pb-4">Chest (cm)</th>
                                            <th className="pb-4">Waist (Inches)</th>
                                            <th className="pb-4">Waist (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium text-white/90">
                                        {ADULT_SIZES.map((row) => (
                                            <tr key={row.size} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 text-primary font-bold">{row.size}</td>
                                                <td className="py-4">{row.chestIn}</td>
                                                <td className="py-4">{row.chestCm}</td>
                                                <td className="py-4">{row.waistIn}</td>
                                                <td className="py-4">{row.waistCm}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-muted">
                                            <th className="pb-4">Size / Age</th>
                                            <th className="pb-4">Height (cm)</th>
                                            <th className="pb-4">Chest (cm)</th>
                                            <th className="pb-4">Waist (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium text-white/90">
                                        {KIDS_SIZES.map((row) => (
                                            <tr key={row.size} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 text-primary font-bold">{row.size}</td>
                                                <td className="py-4">{row.heightCm}</td>
                                                <td className="py-4">{row.chestCm}</td>
                                                <td className="py-4">{row.waistCm}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Sizing Visual & Guidelines */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Size Chart Image Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
                            <h3 className="text-lg font-bold text-white uppercase mb-4 tracking-wide">
                                Adult Puffer & Jacket Fit Guide
                            </h3>
                            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-black/40 border border-white/5 p-2">
                                <Image
                                    src="/assets/size-charts/puffer-jacket-adult.png"
                                    alt="Adult Sizing Details"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Measure Tips */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                            <h3 className="text-lg font-bold text-white uppercase mb-4 tracking-wide flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-primary" />
                                How to Measure
                            </h3>
                            <ul className="space-y-4 text-sm text-muted">
                                <li>
                                    <strong className="text-white block mb-0.5">Chest:</strong>
                                    Measure around the fullest part of your chest, keeping the tape horizontal.
                                </li>
                                <li>
                                    <strong className="text-white block mb-0.5">Waist:</strong>
                                    Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.
                                </li>
                                <li>
                                    <strong className="text-white block mb-0.5">In Between Sizes?</strong>
                                    For a tighter, athletic fit, choose the smaller size. For a loose, comfortable fit, choose the larger size.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
