"use client";

import { motion } from "framer-motion";

export function Footer() {
    return (
        <footer className="relative bg-background-elevated pt-32 pb-16 border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2">
                        <img
                            src="/assets/af-logo.svg"
                            alt="AF Gear"
                            className="w-56 h-auto mb-8 drop-shadow-[0_0_30px_var(--color-primary-glow)] dark:invert"
                        />
                        <p className="text-muted text-lg leading-relaxed max-w-md">
                            Premium teamwear for clubs, schools, and squads. Made to last, made to be affordable.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-10">Collections</h3>
                        <ul className="space-y-6 text-muted text-base">
                            {["Club Teamwear", "Limerick Pride", "Tipperary Elite", "Gaeilge Heritage"].map((item) => (
                                <li key={item} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-3 group">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_var(--color-primary)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Service */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-10">Customer Care</h3>
                        <ul className="space-y-6 text-muted text-base">
                            {[
                                { name: "Our Size Guide", href: "#" },
                                { name: "Shipping Policy", href: "/shipping" },
                                { name: "Terms of Service", href: "/terms" },
                                { name: "Template Downloads", href: "/templates" },
                                { name: "Contact Support", href: "mailto:afgearsports@gmail.com" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="hover:text-primary transition-colors flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_var(--color-primary)]" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5">
                    <p className="text-muted/50 text-sm tracking-widest uppercase">
                        © 2026 AF Gear — Premium Teamwear
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-8 mt-8 md:mt-0 items-center">
                        <a
                            href="https://www.instagram.com/afgearsports/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#E1306C] group-hover:text-[#E1306C] group-hover:shadow-[0_0_20px_rgba(225,48,108,0.5)] group-hover:scale-110 transition-all bg-black/50 text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </div>
                        </a>

                        <a
                            href="https://www.tiktok.com/@alanf07?_r=1&_t=ZN-93gyY6PkXJO"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-all bg-black/50 text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </div>
                        </a>

                        <a
                            href="https://www.facebook.com/share/1KjYruTSK1/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#1877F2] group-hover:text-[#1877F2] group-hover:shadow-[0_0_20px_rgba(24,119,242,0.5)] group-hover:scale-110 transition-all bg-black/50 text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-primary/5 blur-[150px] pointer-events-none" />
        </footer>
    );
}
