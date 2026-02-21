"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export function NewsletterSection() {
    return (
        <section className="relative py-24 overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-background-elevated z-0" />

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background-elevated to-background z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                        Stay in the Loop
                    </span>

                    <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter mb-6 leading-none">
                        Join the <span className="text-primary text-glow">Squad</span>
                    </h2>

                    <p className="text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Sign up for exclusive drops, early access to sales, and insider teamwear news.
                    </p>

                    <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative group">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-white transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-black/50 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-white placeholder:text-muted focus:outline-none focus:border-primary focus:bg-black/80 transition-all font-medium"
                            />
                        </div>
                        <button className="bg-primary text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:scale-105 hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all rounded-sm flex items-center justify-center gap-2">
                            Subscribe <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-[10px] text-muted/50 uppercase tracking-widest">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
