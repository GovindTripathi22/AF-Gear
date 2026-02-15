"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function SchoolUniformSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-background-card">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-primary font-bold uppercase tracking-[0.3em] text-sm"
                        >
                            For Schools & Parents
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-display font-black text-foreground mt-4 leading-[0.9]"
                        >
                            STRESS-FREE <br />
                            <span className="text-muted text-4xl md:text-6xl">SCHOOL UNIFORMS</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 space-y-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-bold text-lg">Zero Admin Hassle</h4>
                                    <p className="text-muted">We take all the ordering work away from the school office. Direct to parent service.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-bold text-lg">Free Sample Days</h3>
                                    <p className="text-muted">We visit your school for "Try-on Days" so students find the perfect fit before ordering.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 flex flex-wrap gap-6"
                        >
                            <Link href="/school-uniforms">
                                <button className="px-10 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl rounded-sm cursor-pointer">
                                    Service My School
                                </button>
                            </Link>
                            <button className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/10 transition-all rounded-sm cursor-pointer">
                                Request Samples
                            </button>
                        </motion.div>
                    </div>

                    {/* Image Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="order-1 lg:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_24px_var(--color-shadow)]"
                    >
                        <img
                            src="/assets/school_uniform_hero.jpg"
                            alt="School Uniform Showcase"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                        <div className="absolute top-6 left-6 px-4 py-2 bg-background-card/80 backdrop-blur-md border border-border text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                            Premium Craftsmanship
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />
        </section>
    );
}
