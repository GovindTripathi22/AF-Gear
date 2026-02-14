"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Scale, Shield, Cookie, RotateCcw, AlertCircle } from "lucide-react";
import Link from "next/link";

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
            className="py-10 border-b border-white/5 last:border-b-0"
        >
            <h3 className="text-sm md:text-base font-display font-black text-primary uppercase tracking-wide mb-5">
                {title}
            </h3>
            <div className="space-y-4 text-muted text-sm md:text-base leading-relaxed">
                {children}
            </div>
        </motion.div>
    );
}

function PolicySection({ icon: Icon, title, id, children }: { icon: React.ElementType; title: string; id: string; children: React.ReactNode }) {
    return (
        <section id={id} className="py-16 border-b border-white/5 last:border-b-0">
            <div className="max-w-[900px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-5 mb-8"
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight pt-2">
                        {title}
                    </h2>
                </motion.div>
                {children}
            </div>
        </section>
    );
}

export default function TermsPage() {
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
                            Legal
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
                            Terms & <span className="text-primary">Conditions</span>
                        </h1>
                        <p className="text-muted text-base mt-6 leading-relaxed max-w-lg">
                            Last Updated: February 2026
                        </p>

                        {/* Quick Nav */}
                        <div className="flex flex-wrap gap-3 mt-8">
                            {[
                                { label: "Terms", href: "#terms" },
                                { label: "Privacy", href: "#privacy" },
                                { label: "Cookies", href: "#cookies" },
                                { label: "Refunds", href: "#refunds" },
                                { label: "Disclaimer", href: "#disclaimer" },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-muted hover:text-primary hover:border-primary/30 transition-all duration-300"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />
            </section>

            {/* ===== TERMS & CONDITIONS ===== */}
            <PolicySection icon={Scale} title="Terms & Conditions" id="terms">
                <SectionBlock title="1. Introduction">
                    <p>These Terms &amp; Conditions govern your use of the AF GEAR website and the purchase of products from us.</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Business Name: AF GEAR</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Country of Registration: Ireland</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Email: afgearsports@gmail.com</li>
                    </ul>
                    <p>By using this website or placing an order, you agree to these Terms.</p>
                </SectionBlock>

                <SectionBlock title="2. Eligibility">
                    <p>You must be at least 18 years old to place an order. If under 18, you must have parental/guardian consent.</p>
                </SectionBlock>

                <SectionBlock title="3. Products">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />All products are subject to availability.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />We reserve the right to discontinue products at any time.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Colours may vary slightly due to screen displays.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Minor design changes may occur without prior notice.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="4. Pricing & Payment">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />All prices are listed in &euro; (Euro) unless otherwise stated.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />VAT is included where applicable.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />International customers may be responsible for import duties or customs fees.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />We reserve the right to correct pricing errors.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Payment must be received before order dispatch.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="5. Order Acceptance">
                    <p>We reserve the right to:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Refuse or cancel orders</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Cancel suspected fraudulent transactions</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Limit quantities purchased per customer</li>
                    </ul>
                    <p>If payment has been taken and an order is cancelled, a full refund will be issued.</p>
                </SectionBlock>

                <SectionBlock title="6. Shipping">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Processing time: 1&ndash;3 business days.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Delivery times are estimates and not guaranteed.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />AF GEAR is not responsible for delays caused by couriers or customs.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Risk passes to the customer upon delivery.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />If a parcel is lost or damaged, contact us within 7 days of expected delivery.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="7. Returns & Refunds">
                    <p className="font-bold text-white">EU &amp; Ireland Customers</p>
                    <p>Under EU consumer law, customers have a 14-day cooling-off period from delivery.</p>
                    <p className="font-bold text-white mt-4">To qualify:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Items must be unworn</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Tags attached</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Returned in original condition</li>
                    </ul>
                    <p>Customers are responsible for return shipping unless the item is faulty. Refunds are processed within 14 days of receiving returned goods.</p>
                    <p className="font-bold text-white mt-4">Non-Returnable Items:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Customised products</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Worn or damaged items</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Clearance items (if marked final sale)</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="8. Faulty or Defective Items">
                    <p>If an item is defective:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Contact us within 14 days of receipt.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Provide photos of the issue.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />We may offer replacement, repair, or refund.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="9. Product Use & Liability Disclaimer">
                    <p>AF GEAR products are designed for athletic performance. Customers are responsible for ensuring proper fit and using products appropriately.</p>
                    <p>AF GEAR shall not be liable for injuries, damages, or losses arising from misuse or improper wear. Our liability is limited to the purchase price of the product.</p>
                </SectionBlock>

                <SectionBlock title="10. Intellectual Property">
                    <p>All content including logos, designs, product names, graphics and images are the intellectual property of AF GEAR and may not be reproduced without written consent. Legal action may be taken against infringement.</p>
                </SectionBlock>

                <SectionBlock title="11. Governing Law">
                    <p>These Terms are governed by Irish law. Any disputes shall be subject to the courts of Ireland.</p>
                </SectionBlock>
            </PolicySection>

            {/* ===== PRIVACY POLICY ===== */}
            <PolicySection icon={Shield} title="Privacy Policy (GDPR Compliant)" id="privacy">
                <SectionBlock title="1. Data We Collect">
                    <p>We may collect:</p>
                    <ul className="space-y-2 ml-4">
                        {["Name", "Address", "Email", "Phone number", "Payment details (processed securely via third-party providers)", "IP address", "Website usage data", "Marketing preferences"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                </SectionBlock>

                <SectionBlock title="2. Why We Collect Data">
                    <p>We use data to:</p>
                    <ul className="space-y-2 ml-4">
                        {["Process orders", "Deliver products", "Respond to customer service requests", "Improve our website", "Send marketing emails (with consent)"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                </SectionBlock>

                <SectionBlock title="3. Legal Basis (GDPR)">
                    <p>We process data based on:</p>
                    <ul className="space-y-2 ml-4">
                        {["Contract (to fulfil orders)", "Consent (marketing)", "Legal obligation (tax records)", "Legitimate business interests"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                </SectionBlock>

                <SectionBlock title="4. Data Sharing">
                    <p>We may share data with:</p>
                    <ul className="space-y-2 ml-4">
                        {["Payment processors (Stripe/PayPal)", "Shipping providers", "Email marketing platforms", "Advertising platforms (Meta / Google)"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                    <p className="font-bold text-white">We do not sell personal data.</p>
                </SectionBlock>

                <SectionBlock title="5. Data Retention">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Order records retained for legal/tax compliance.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Marketing data retained until consent is withdrawn.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="6. Your Rights (EU Residents)">
                    <p>You have the right to:</p>
                    <ul className="space-y-2 ml-4">
                        {["Access your data", "Correct inaccurate data", "Request deletion", "Withdraw consent", "Lodge a complaint with the Data Protection Commission (Ireland)"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                    <p>Contact: <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors underline underline-offset-4">afgearsports@gmail.com</a></p>
                </SectionBlock>

                <SectionBlock title="7. Security">
                    <p>We use secure hosting and SSL encryption to protect customer data.</p>
                </SectionBlock>
            </PolicySection>

            {/* ===== COOKIE POLICY ===== */}
            <PolicySection icon={Cookie} title="Cookie Policy" id="cookies">
                <SectionBlock title="How We Use Cookies">
                    <p>AF GEAR uses cookies to:</p>
                    <ul className="space-y-2 ml-4">
                        {["Enable website functionality", "Analyse traffic (Google Analytics)", "Track ad performance (Meta Pixel)", "Improve user experience"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                    <p>You may accept or decline non-essential cookies via our cookie banner. Essential cookies cannot be disabled as they are required for checkout functionality.</p>
                </SectionBlock>
            </PolicySection>

            {/* ===== REFUND POLICY ===== */}
            <PolicySection icon={RotateCcw} title="Refund Policy" id="refunds">
                <SectionBlock title="Our Refund Commitment">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />14-day returns (EU customers)</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Refunds processed within 14 days of receiving returned item</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Exchanges subject to stock availability</li>
                    </ul>
                    <p className="mt-4">Contact: <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors underline underline-offset-4">afgearsports@gmail.com</a></p>
                </SectionBlock>
            </PolicySection>

            {/* ===== WEBSITE DISCLAIMER ===== */}
            <PolicySection icon={AlertCircle} title="Website Disclaimer" id="disclaimer">
                <SectionBlock title="Important Notice">
                    <p>AF GEAR makes no guarantees regarding:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Continuous website availability</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Typographical errors</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Stock availability accuracy</li>
                    </ul>
                    <p>We reserve the right to modify website content at any time.</p>
                </SectionBlock>
            </PolicySection>

            {/* Bottom Contact */}
            <section className="py-16 border-t border-white/5">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <p className="text-muted text-sm">
                            Questions? Contact us at{" "}
                            <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors duration-300 underline underline-offset-4">
                                afgearsports@gmail.com
                            </a>
                        </p>
                        <p className="text-muted/50 text-xs mt-4 uppercase tracking-widest">
                            Last updated: February 2026
                        </p>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
