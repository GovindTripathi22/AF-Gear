"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Dock } from "@/components/Dock";
import { Download, Info } from "lucide-react";

export default function TemplatesPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Header */}
            <section className="relative pt-32 pb-16 px-4 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tight mb-4">
                        Design <span className="text-primary">Templates</span>
                    </h1>
                    <p className="text-muted text-lg max-w-xl mx-auto">
                        High-quality blank templates for visualizing your team's custom kit.
                        Perfect for sketching initial ideas before our design team takes over.
                    </p>
                </motion.div>
            </section>

            {/* Template Showcase */}
            <section className="px-4 md:px-8 pb-32">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-background-card border border-border rounded-2xl overflow-hidden shadow-[0_8px_40px_var(--color-shadow)]"
                    >
                        {/* Preview Header */}
                        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">GAA Jersey & Shorts Kit</h2>
                                <p className="text-muted text-xs uppercase tracking-widest mt-1">Standard Fit / Front & Back View</p>
                            </div>
                            <a
                                href="/assets/gaa_jersey_template_v1.svg"
                                download="AF_Gear_GAA_Template.svg"
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 transition-all shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                Download Template
                            </a>
                        </div>

                        {/* Image Preview Area */}
                        <div className="bg-background-elevated p-8 md:p-16 flex items-center justify-center min-h-[500px]">
                            <div className="relative w-full max-w-3xl aspect-video bg-white rounded-lg shadow-sm p-8 flex items-center justify-center border border-border/50">
                                {/* Placeholder for the generated image */}
                                <img
                                    src="/assets/gaa_jersey_template_v1.svg"
                                    alt="GAA Jersey Template Preview"
                                    className="w-full h-full object-contain mix-blend-multiply opacity-90"
                                />

                                {/* Watermark/Badge */}
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">
                                    AF GEAR • TEMPLATE
                                </div>
                            </div>
                        </div>

                        {/* Info Footer */}
                        <div className="p-6 bg-primary-soft/30 flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-foreground text-sm font-bold uppercase tracking-wide mb-1">How to use</h3>
                                <p className="text-muted text-sm leading-relaxed">
                                    Download this image to sketch your colors and crest placement.
                                    Send it to us via the <a href="/contact" className="text-primary underline hover:text-primary-glow">Contact Page</a> to get a production-ready mock-up from our design team.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <Dock />
        </main>
    );
}
