"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Dock } from "@/components/Dock";
import Link from "next/link";
import {
    ArrowRight,
    Shield,
    ShoppingBag,
    RefreshCw,
    Palette,
    Heart,
    GraduationCap,
    Trophy,
    Users,
    PartyPopper,
    Swords,
    MessageSquare,
    Package,
    CreditCard,
    Sparkles,
    Globe,
    Store,
    Handshake,
    Mail,
    Phone,
} from "lucide-react";

const WHY_CHOOSE = [
    {
        icon: Shield,
        title: "Built to Last",
        desc: "Reinforced stitching, colourfast fabrics, and durable performance materials designed for repeated washing and active school days.",
    },
    {
        icon: ShoppingBag,
        title: "Easy for Parents",
        desc: "We can create a dedicated online school shop where parents order directly — reducing admin for staff.",
    },
    {
        icon: RefreshCw,
        title: "Consistent Supply",
        desc: "We offer long-term kit continuity, so schools don't have to redesign uniforms every year.",
    },
    {
        icon: Palette,
        title: "Modern & Professional Design",
        desc: "Clean, modern sportswear that students are proud to wear.",
    },
    {
        icon: Heart,
        title: "Inclusive Options",
        desc: "Tag-free labels, comfortable fabrics and inclusive sizing to ensure every student feels confident.",
    },
];

const SCHOOL_RANGE = [
    {
        icon: GraduationCap,
        title: "Primary School PE Uniforms",
        desc: "Comfortable, durable kits built for active school days.",
    },
    {
        icon: Trophy,
        title: "Secondary School Sportswear",
        desc: "Match kits, training wear, half-zips, and performance gear for school teams.",
    },
    {
        icon: Users,
        title: "Staff & Coach Wear",
        desc: "Premium polos, jackets, tracksuits and outerwear for teachers and coaches.",
    },
    {
        icon: PartyPopper,
        title: "TY & Leavers Wear",
        desc: "Custom hoodies and commemorative gear students will actually want to wear.",
    },
    {
        icon: Swords,
        title: "School Teamwear",
        desc: "Custom kits for GAA, soccer, rugby, athletics and multi-sport programmes.",
    },
];

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Consultation",
        desc: "We discuss your needs, sport requirements, colours and budget.",
    },
    {
        step: "02",
        title: "Design & Approval",
        desc: "We create digital mock-ups for approval.",
    },
    {
        step: "03",
        title: "Sizing & Samples",
        desc: "We provide sizing guides or organise sample fittings where required.",
    },
    {
        step: "04",
        title: "Production",
        desc: "High-quality manufacturing with reliable turnaround times.",
    },
    {
        step: "05",
        title: "Delivery or Online Shop Launch",
        desc: "Bulk delivery to school or launch of your custom online school shop.",
    },
];

const CUSTOM_FEATURES = [
    "Crest embroidery",
    "School motto printing (Irish or English)",
    "House colour options",
    "Student initials",
    "Staff name embroidery",
    "Custom design consultations",
];

const INCLUSIVE_FEATURES = [
    "Inclusive sizing options",
    "Comfortable, sensory-conscious fabrics",
    "Irish-language design options for Gaelscoils",
    "Modern, confidence-building designs",
];

const SHOP_FEATURES = [
    { icon: ShoppingBag, text: "Parents order directly" },
    { icon: CreditCard, text: "Secure payment system" },
    { icon: Package, text: "No stock handling required by school" },
    { icon: RefreshCw, text: "Reorders available year-round" },
];

const TRUST_VALUES = [
    "Reliable delivery timelines",
    "Clear communication",
    "Transparent pricing structures",
    "Long-term school partnerships",
];

export default function SchoolUniformPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted hover:text-primary text-sm font-medium mb-8 transition-colors duration-300"
                    >
                        ← Back to Shop
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                            Schools &amp; Education
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">
                            Performance Wear
                            <br />
                            <span className="text-primary">Built for School Life.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted mt-8 leading-relaxed max-w-2xl">
                            Modern. Durable. Inclusive. Designed for Today&apos;s Students.
                        </p>

                        <p className="text-base text-muted/80 mt-4 leading-relaxed max-w-2xl">
                            At AF GEAR, we supply high-quality school sportswear, PE uniforms, teamwear and staff apparel
                            designed to perform — on the pitch, in the gym and in everyday school life. Whether you&apos;re a
                            primary school, secondary school, Gaelscoil or international academy, we provide complete
                            sportswear solutions with simple ordering and reliable long-term supply.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-10">
                            <a
                                href="mailto:afgearsports@gmail.com?subject=School%20Consultation%20Request"
                                className="inline-flex items-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-8 py-4 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300"
                            >
                                Book a School Consultation
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:afgearsports@gmail.com?subject=Schools%20Brochure%20Request"
                                className="inline-flex items-center gap-3 border border-white/20 text-white font-bold uppercase tracking-[0.15em] text-sm px-8 py-4 rounded-sm hover:bg-white/5 hover:border-primary/40 transition-all duration-300"
                            >
                                Download Schools Brochure
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/3 blur-[150px] pointer-events-none" />
                <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            </section>

            {/* ===== WHY SCHOOLS CHOOSE AF GEAR ===== */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                            Why Schools Choose <span className="text-primary">AF Gear</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {WHY_CHOOSE.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-white font-display font-black text-lg uppercase tracking-tight mb-3">{item.title}</h3>
                                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== OUR SCHOOL RANGE ===== */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                            Our School <span className="text-primary">Range</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SCHOOL_RANGE.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="flex items-start gap-5 p-6 rounded-xl border border-white/5 hover:border-primary/15 transition-all duration-300"
                            >
                                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-white font-display font-bold text-base uppercase tracking-tight mb-2">{item.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CUSTOM DESIGN ===== */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                                Customisation
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight mb-6">
                                Custom Design <span className="text-primary">For Your School</span>
                            </h2>
                            <p className="text-muted text-base leading-relaxed mb-8">
                                Every school has its own identity — your sportswear should reflect that.
                                From traditional to modern, we create kits your students will be proud of.
                            </p>
                            <ul className="space-y-4">
                                {CUSTOM_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-muted text-base">
                                        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Inclusive by Design */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-2xl bg-white/[0.02] border border-white/5"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-4">
                                Inclusive by <span className="text-primary">Design</span>
                            </h3>
                            <p className="text-muted text-base leading-relaxed mb-6">
                                At AF GEAR, we believe sport is for everyone. Because every student deserves to feel
                                comfortable and confident in their uniform.
                            </p>
                            <ul className="space-y-3">
                                {INCLUSIVE_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-muted text-sm">
                                        <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                            How It <span className="text-primary">Works</span>
                        </h2>
                        <p className="text-muted mt-4 text-lg">Simple. Professional. Stress-free.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {HOW_IT_WORKS.map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="relative text-center p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300"
                            >
                                <span className="text-4xl font-display font-black text-primary/20">{item.step}</span>
                                <h3 className="text-white font-display font-bold text-sm uppercase tracking-tight mt-3 mb-2">{item.title}</h3>
                                <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                                {i < HOW_IT_WORKS.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-primary/30">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SCHOOL ONLINE SHOP ===== */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <Store className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight mb-6">
                                School Online <span className="text-primary">Shop Solution</span>
                            </h2>
                            <p className="text-muted text-base leading-relaxed mb-8">
                                We can build a private online shop exclusively for your school.
                                We handle fulfilment — your staff focus on education.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SHOP_FEATURES.map((feat) => (
                                    <div key={feat.text} className="flex items-center gap-3 p-4 rounded-lg border border-white/5 bg-white/[0.02]">
                                        <feat.icon className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-sm text-muted">{feat.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Trust & Reliability */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-2xl bg-white/[0.02] border border-white/5"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <Handshake className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-4">
                                Trust &amp; <span className="text-primary">Reliability</span>
                            </h3>
                            <p className="text-muted text-base leading-relaxed mb-6">
                                AF GEAR is committed to building lasting relationships with schools.
                                We don&apos;t just supply uniforms — we build partnerships.
                            </p>
                            <ul className="space-y-3">
                                {TRUST_VALUES.map((val) => (
                                    <li key={val} className="flex items-center gap-3 text-muted text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {val}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="py-32 border-t border-white/5 relative overflow-hidden">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight mb-6">
                            Let&apos;s Work <span className="text-primary">Together</span>
                        </h2>
                        <p className="text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Whether you&apos;re reviewing your current supplier or launching a new school sportswear
                            programme, we&apos;d love to speak with you.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:afgearsports@gmail.com?subject=School%20Consultation"
                                className="inline-flex items-center justify-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-10 py-4 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Book a Consultation
                            </a>
                            <a
                                href="mailto:afgearsports@gmail.com?subject=Quote%20Request"
                                className="inline-flex items-center justify-center gap-3 border border-white/20 text-white font-bold uppercase tracking-[0.15em] text-sm px-10 py-4 rounded-sm hover:bg-white/5 hover:border-primary/40 transition-all duration-300"
                            >
                                <Mail className="w-4 h-4" />
                                Request a Quote
                            </a>
                        </div>

                        <p className="text-muted text-sm mt-8">
                            <Mail className="w-3.5 h-3.5 inline mr-2" />
                            <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors underline underline-offset-4">
                                afgearsports@gmail.com
                            </a>
                        </p>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            </section>

            {/* ===== ORDER FORM (kept from original) ===== */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]" id="order-form">
                <div className="max-w-[900px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
                            School Uniform <span className="text-primary">Order Form</span>
                        </h2>
                        <p className="text-muted mt-4">Fill out the form below and we&apos;ll get back to you.</p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-12 space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">School Name</label>
                                <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Enter school name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Contact Person</label>
                                <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Full name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Email</label>
                                <input type="email" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Email address" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Phone</label>
                                <input type="tel" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Phone number" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">School Type</label>
                                <select className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:border-primary outline-none transition-colors">
                                    <option>Select type</option>
                                    <option>Primary School</option>
                                    <option>Secondary School</option>
                                    <option>Gaelscoil</option>
                                    <option>International Academy</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Estimated Students</label>
                                <select className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:border-primary outline-none transition-colors">
                                    <option>Select range</option>
                                    <option>Under 100</option>
                                    <option>100 – 300</option>
                                    <option>300 – 600</option>
                                    <option>600+</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-muted text-xs font-bold uppercase tracking-widest">What are you looking for?</label>
                            <textarea rows={4} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50 resize-none" placeholder="PE uniforms, school teamwear, staff wear, etc." />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-12 py-4 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300 cursor-pointer"
                            >
                                Submit Enquiry
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.form>
                </div>
            </section>

            <Footer />
            <Dock />
        </main>
    );
}
