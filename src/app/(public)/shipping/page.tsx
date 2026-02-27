"use client";

import { motion } from "framer-motion";
import { Truck, Globe, Package, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const sections = [
    {
        icon: Truck,
        title: "Domestic Shipping (Ireland)",
        content: [
            "We offer a flat rate shipping fee of €6 for all orders within Ireland.",
        ],
        bullets: [
            "Stock items: Processed within 2-3 business days, with delivery typically taking 3-5 business days.",
            "Non-stock/custom items: Processed within 4-5 weeks, with delivery times varying based on production and shipping schedules.",
        ],
    },
    {
        icon: Globe,
        title: "International Shipping",
        content: [
            "For international shipping rates and delivery times, please contact us at afgearsports@gmail.com before placing your order. We will provide a shipping quote based on your location.",
        ],
    },
    {
        icon: Package,
        title: "Order Processing & Tracking",
        content: [
            "Once your order is dispatched, you will receive a confirmation email with tracking details (if applicable). Please ensure your shipping address is correct at checkout, as we are unable to make changes once the order has been shipped.",
        ],
    },
    {
        icon: AlertTriangle,
        title: "Delays & Issues",
        content: [
            "While we aim to meet estimated delivery times, delays may occur due to factors beyond our control, such as customs processing or courier delays. If you experience any issues with your delivery, please reach out to us at afgearsports@gmail.com.",
        ],
    },
];

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Hero Banner */}
            <section className="relative pt-32 pb-20 border-b border-white/5">
                <div className="max-w-[900px] mx-auto px-4 md:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted hover:text-primary text-sm font-medium mb-8 transition-colors duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                            Customer Care
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
                            Shipping <span className="text-primary">Policy</span>
                        </h1>
                        <p className="text-muted text-lg mt-6 leading-relaxed max-w-lg">
                            Everything you need to know about how we ship your AF Gear orders.
                        </p>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />
            </section>

            {/* Policy Sections */}
            <section className="py-20">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-0">
                    {sections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group py-12 border-b border-white/5 last:border-b-0"
                        >
                            <div className="flex items-start gap-5">
                                {/* Icon */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                    <section.icon className="w-5 h-5 text-primary" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight mb-4">
                                        {section.title}
                                    </h2>

                                    {section.content.map((paragraph, j) => (
                                        <p key={j} className="text-muted text-base leading-relaxed mb-4 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))}

                                    {section.bullets && (
                                        <ul className="space-y-3 mt-4">
                                            {section.bullets.map((bullet, k) => (
                                                <li key={k} className="flex items-start gap-3 text-muted text-base leading-relaxed">
                                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Thank You */}
            <section className="py-16 border-t border-white/5">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-primary font-display font-black text-2xl uppercase tracking-tight"
                    >
                        Thank you for choosing AF Gear!
                    </motion.p>
                    <p className="text-muted text-sm mt-4">
                        Questions? Reach us at{" "}
                        <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors duration-300 underline underline-offset-4">
                            afgearsports@gmail.com
                        </a>
                    </p>
                </div>
            </section>
        </main>
    );
}
