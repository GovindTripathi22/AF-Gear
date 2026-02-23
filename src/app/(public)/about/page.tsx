"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/ui/Footer";
import { Dock } from "@/components/ui/Dock";
import { Heart, Users, Shield, Sparkles, CheckCircle2 } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const }
    }
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative max-w-4xl mx-auto text-center"
                >
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-5 py-2 rounded-full mb-8 border border-primary/20">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-[0.9] mb-6">
                        About <span className="text-primary">AF Gear</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                        Built for Real Families. Priced Fairly.
                    </p>
                </motion.div>
            </section>

            {/* Mission Statement */}
            <section className="px-4 md:px-8 pb-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    <motion.div variants={fadeUp} custom={0} className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                            AF GEAR was created for one simple reason:
                        </p>
                        <p className="text-3xl md:text-4xl font-display font-black text-primary uppercase leading-tight mb-8">
                            Sport should be accessible to everyone.
                        </p>
                        <p className="text-muted leading-relaxed mb-6">
                            Across Ireland, families are feeling the rising cost of basic sportswear. Jerseys, training tops and half-zips were starting to feel like a luxury — and we didn&apos;t think that was right.
                        </p>
                        <p className="text-white font-bold text-lg">So we built AF GEAR.</p>
                    </motion.div>

                    {/* Values Grid */}
                    <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { icon: Sparkles, text: "High-quality sportswear" },
                            { icon: Heart, text: "Fair, honest pricing" },
                            { icon: Shield, text: "No inflated brand tax" },
                            { icon: Users, text: "Built to last" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center group hover:border-primary/30 transition-colors">
                                <item.icon className="w-6 h-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-sm text-white/80 font-medium">{item.text}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Grassroots Section */}
            <section className="px-4 md:px-8 pb-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeUp} custom={0} className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Community First</span>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase leading-tight mb-6">
                                Grassroots First
                            </h2>
                            <p className="text-muted leading-relaxed mb-4">
                                Sport begins at grassroots level — in schoolyards, parish pitches and local clubs.
                            </p>
                            <div className="space-y-3 text-white/80">
                                <p>That&apos;s where confidence grows.</p>
                                <p>That&apos;s where friendships form.</p>
                                <p>That&apos;s where pride begins.</p>
                            </div>
                            <p className="text-muted leading-relaxed mt-6">
                                AF GEAR is designed for those moments — for the Saturday mornings, the midweek sessions, and the families who make it all happen.
                            </p>
                        </div>
                        <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/assets/1000030808.png')] bg-cover bg-center opacity-30" />
                            <div className="relative text-center px-8">
                                <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
                                <p className="text-white font-display font-black text-2xl uppercase">Community</p>
                                <p className="text-muted text-sm mt-2">At the heart of everything we do</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Meet the Founders */}
            <section className="px-4 md:px-8 pb-32">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >
                        {/* Image Side */}
                        <motion.div 
                            variants={fadeUp} 
                            custom={0}
                            className="relative"
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                                <img 
                                    src="/assets/alan-mollie.jpg" 
                                    alt="Alan and Mollie - Founders of AF GEAR" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Glass Overlay with Attribution */}
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                                    <p className="text-white font-display font-black text-xl uppercase tracking-wider">Alan & Mollie</p>
                                    <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mt-1">Founders of AF GEAR</p>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                        </motion.div>

                        {/* Content Side */}
                        <motion.div 
                            variants={fadeUp} 
                            custom={1}
                            className="flex flex-col"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full w-fit">
                                Meet the Founders
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase leading-[0.9] mb-8">
                                A <span className="text-primary">Personal</span> Mission
                            </h2>
                            
                            <div className="space-y-6 text-lg text-muted leading-relaxed">
                                <p>
                                    Hi, my name is Alan, owner of AF GEAR along with my daughter Mollie. I setup this business to help the normal Irish family to be able to afford sportswear.
                                </p>
                                <p>
                                    Crazy markups have put families under added pressure to kit their kids out in their favourite gear and I think it&apos;s very unfair. My aim is to keep prices low while still offering top quality sportswear that is both comfortable and durable.
                                </p>
                                <p>
                                    My daughter Mollie has shown a keen interest in the business and has helped design various products which are attractive to the younger generation.
                                </p>
                                <p className="text-white font-medium italic">
                                    &ldquo;Thanks for visiting our website and helping us grow our little business even more.&rdquo;
                                </p>
                            </div>

                            <div className="mt-12 flex flex-col gap-2">
                                <p className="text-primary font-display font-black text-2xl uppercase tracking-tighter">Alan & Mollie</p>
                                <p className="text-[10px] text-muted uppercase tracking-[0.3em]">AF GEAR Family</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Our Promise */}
            <section className="px-4 md:px-8 pb-32">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    <motion.div variants={fadeUp} custom={0} className="bg-gradient-to-br from-primary/10 via-white/5 to-transparent border border-primary/20 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-display font-black text-white uppercase mb-8 text-center">Our Promise</h2>
                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                            {[
                                "Premium-quality materials",
                                "Fair pricing for families",
                                "Built for real life",
                                "Always rooted in community",
                            ].map((promise, i) => (
                                <div key={i} className="flex items-center gap-3 bg-black/30 rounded-lg px-5 py-4">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-white font-medium">{promise}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center border-t border-white/10 pt-8">
                            <p className="text-xl text-white/80 mb-2">AF GEAR isn&apos;t about hype.</p>
                            <p className="text-3xl font-display font-black text-primary uppercase">It&apos;s about heart.</p>
                            <p className="text-muted mt-4">And we&apos;re only getting started.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>


            <Footer />
            <Dock />
        </main>
    );
}
