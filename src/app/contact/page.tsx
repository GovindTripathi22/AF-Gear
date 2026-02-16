"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Dock } from "@/components/Dock";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Form Component to handle search params
function ContactForm() {
    const searchParams = useSearchParams();
    const subjectParam = searchParams.get("subject");
    const productParam = searchParams.get("product");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: subjectParam === "interest" ? "interest" : "",
        message: productParam ? `I'm interested in the upcoming launch of: ${productParam}. Please notify me when it's available.` : "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const update = (field: string, value: string) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5"
        >
            <h2 className="text-xl font-display font-black text-white uppercase tracking-wide mb-2">
                Send a Message
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        placeholder="John Murphy"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        placeholder="+353 86 XXX XXXX"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Subject *
                    </label>
                    <select
                        required
                        value={formData.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                    >
                        <option value="" className="bg-[#111]">Select subject...</option>
                        <option value="interest" className="bg-[#111]">Register Interest (Launching Soon)</option>
                        <option value="custom-kit" className="bg-[#111]">Custom Kit Quote</option>
                        <option value="school-uniform" className="bg-[#111]">School Uniforms</option>
                        <option value="bulk-order" className="bg-[#111]">Bulk Order</option>
                        <option value="irish-language" className="bg-[#111]">Irish Language Jerseys</option>
                        <option value="general" className="bg-[#111]">General Enquiry</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                    Message *
                </label>
                <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                />
            </div>

            <button
                type="submit"
                disabled={submitted}
                className={`w-full flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] text-sm py-4 rounded-sm transition-all duration-300 ${submitted
                    ? "bg-primary/50 text-black/50 cursor-not-allowed"
                    : "bg-primary text-black hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)]"
                    }`}
            >
                <Send className="w-4 h-4" />
                {submitted ? "Message Sent ✓" : "Send Message"}
            </button>

            {submitted && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary text-sm text-center font-bold"
                >
                    Thanks! We&apos;ll be in touch within 24 hours.
                </motion.p>
            )}
        </form>
    );
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Hero */}
            <section className="relative pt-40 pb-16 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative max-w-4xl mx-auto text-center"
                >
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-5 py-2 rounded-full mb-8 border border-primary/20">
                        Get in Touch
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-[0.9] mb-6">
                        Contact <span className="text-primary">Us</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
                        Have a question about custom kits, school uniforms, or bulk orders? We&apos;d love to hear from you.
                    </p>
                </motion.div>
            </section>

            {/* Contact Info Cards + Form */}
            <section className="px-4 md:px-8 pb-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
                    {/* Left — Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        {[
                            {
                                icon: Mail,
                                label: "Email",
                                value: "info@afgear.ie",
                                href: "mailto:info@afgear.ie",
                            },
                            {
                                icon: Phone,
                                label: "Phone",
                                value: "+353 86 XXX XXXX",
                                href: "tel:+353860000000",
                            },
                            {
                                icon: MapPin,
                                label: "Location",
                                value: "Ireland",
                                href: null,
                            },
                            {
                                icon: Clock,
                                label: "Hours",
                                value: "Mon – Fri: 9am – 6pm",
                                href: null,
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4 group hover:border-primary/30 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-1">
                                        {item.label}
                                    </p>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="text-white font-medium hover:text-primary transition-colors"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-white font-medium">{item.value}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Social / Quick Quote */}
                        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-6 mt-4">
                            <MessageSquare className="w-6 h-6 text-primary mb-3" />
                            <p className="text-white font-bold mb-1">Quick Quote</p>
                            <p className="text-muted text-sm leading-relaxed">
                                Need a quote for your club or school? Fill out the form and we&apos;ll get back to you within 24 hours.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right — Contact Form (Suspense Wrapper for useSearchParams) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-3"
                    >
                        <Suspense fallback={<div className="text-white">Loading form...</div>}>
                            <ContactForm />
                        </Suspense>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <Dock />
        </main>
    );
}
