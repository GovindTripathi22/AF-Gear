"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Dock } from "@/components/Dock";
import Link from "next/link";

export default function SchoolUniformPage() {
    const [step, setStep] = useState(1);

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Minimal Header */}
            <nav className="relative z-50 py-8 px-4 md:px-8 flex justify-between items-center">
                <Link href="/">
                    <h2 className="text-2xl font-display font-black text-foreground tracking-widest">
                        AF <span className="text-primary">GEAR</span>
                    </h2>
                </Link>
                <Link href="/">
                    <button className="text-muted hover:text-foreground text-sm uppercase tracking-widest transition-colors cursor-pointer">
                        Back to Shop
                    </button>
                </Link>
            </nav>

            <section className="relative py-12 px-4 md:px-8 flex items-center justify-center">
                <div className="max-w-[1200px] w-full bg-background-card rounded-3xl overflow-hidden border border-border shadow-[0_4px_32px_var(--color-shadow)] flex flex-col lg:flex-row">

                    {/* Left: Form Area */}
                    <div className="flex-1 p-8 md:p-12 lg:p-16">
                        {/* Progress Indicator */}
                        <div className="flex items-center gap-4 mb-12">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${step >= s ? 'bg-primary' : 'bg-muted/30'}`} />
                                    {s < 3 && <div className={`w-8 h-[1px] ${step > s ? 'bg-primary' : 'bg-muted/30'}`} />}
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-display font-black text-foreground uppercase tracking-tight">
                                            School Uniform Order Form
                                        </h1>
                                        <p className="text-muted mt-2 uppercase tracking-widest text-xs">Phase 1: Basic Information</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-muted text-xs font-bold uppercase tracking-widest">Student&apos;s Full Name:</label>
                                            <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-muted text-xs font-bold uppercase tracking-widest">Grade Level:</label>
                                            <select className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground appearance-none focus:border-primary outline-none transition-colors">
                                                <option>Select Grade</option>
                                                <option>Junior Infants</option>
                                                <option>Senior Infants</option>
                                                <option>1st - 6th Class</option>
                                                <option>1st - 6th Year</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-muted text-xs font-bold uppercase tracking-widest">Gender:</label>
                                            <select className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground appearance-none focus:border-primary outline-none transition-colors">
                                                <option>Select Gender</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Unisex</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-muted text-xs font-bold uppercase tracking-widest">Size Selection:</label>
                                            <select className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground appearance-none focus:border-primary outline-none transition-colors">
                                                <option>Select Size</option>
                                                <option>Age 4-5</option>
                                                <option>Age 5-6</option>
                                                <option>Age 7-8</option>
                                                <option>Small</option>
                                                <option>Medium</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-muted text-xs font-bold uppercase tracking-widest">Contact Number:</label>
                                            <input type="tel" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-muted text-xs font-bold uppercase tracking-widest">Email Address:</label>
                                            <input type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted/50" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-muted text-xs font-bold uppercase tracking-widest">Preferred Method for Order Fulfillment:</label>
                                        <select className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground appearance-none focus:border-primary outline-none transition-colors">
                                            <option>Select Method</option>
                                            <option>School Delivery</option>
                                            <option>Home Shipping</option>
                                            <option>Pickup</option>
                                        </select>
                                    </div>

                                    <div className="pt-8 flex justify-end">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="px-8 py-3 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-colors rounded-sm cursor-pointer"
                                        >
                                            Next &rarr;
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <h1 className="text-3xl md:text-4xl font-display font-black text-foreground uppercase tracking-tight">Phase 2: Success</h1>
                                    <p className="text-muted">Under development. This will handle payment and confirmation.</p>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-8 py-3 border border-border text-foreground font-black uppercase tracking-widest text-sm cursor-pointer hover:bg-primary-soft transition-colors rounded-sm"
                                    >
                                        Go Back
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Visual Area */}
                    <div className="hidden lg:block w-1/3 min-h-[600px] relative">
                        <img
                            src="/assets/school_uniform_hero.png"
                            alt="Student Try-on Day"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
                        />
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background-card" />

                        <div className="absolute bottom-12 left-12 right-12 z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-background/80 backdrop-blur-xl p-8 rounded-2xl border border-border"
                            >
                                <h3 className="text-primary font-bold text-lg">Coming to your school?</h3>
                                <p className="text-muted text-sm mt-2">Sign up for a Free Sample Day. No obligation, just the right fit for every student.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <Dock />
        </main>
    );
}
