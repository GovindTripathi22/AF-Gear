"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const pubJerseys = [
    "/assets/pub-jerseys/1000037870.jpg",
    "/assets/pub-jerseys/1000037872.jpg",
    "/assets/pub-jerseys/1000037874.jpg",
    "/assets/pub-jerseys/1000038099.png",
];

export function PubJerseysSection() {
    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-background">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-primary font-bold uppercase tracking-[0.3em] text-xs md:text-sm"
                        >
                            Past Designs by AF GEAR
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-foreground mt-3 md:mt-4 leading-[0.9]"
                        >
                            PUB <br />
                            <span className="text-muted text-3xl sm:text-4xl md:text-6xl">JERSEYS</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 md:mt-8 space-y-6"
                        >
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1 flex-shrink-0">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-bold text-base md:text-lg lg:text-xl">Proven Excellence</h4>
                                    <p className="text-muted text-sm md:text-lg mt-1 md:mt-2">
                                        Check out some of our past designs. Pub Jerseys have become a huge trend, and we&apos;ve designed some of the most iconic ones in the country.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1 flex-shrink-0">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-bold text-base md:text-lg lg:text-xl">Custom for Your Pub</h3>
                                    <p className="text-muted text-sm md:text-lg mt-1 md:mt-2">If you&apos;re a pub owner looking to create a unique identity for your patrons, get in touch today for a custom design!</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-6 w-full"
                        >
                            <Link href="/contact" className="w-full sm:w-auto">
                                <button className="w-full px-8 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl rounded-sm cursor-pointer border border-primary">
                                    Start Your Design
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Images Grid - Show all 4 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="order-1 lg:order-2 grid grid-cols-2 gap-3 sm:gap-4"
                    >
                        {pubJerseys.map((img, idx) => (
                            <div key={idx} className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                                <Image
                                    src={img}
                                    alt={`Pub Jersey Past Design ${idx + 1}`}
                                    fill
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">AF GEAR DESIGN</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Background Accent Glow */}
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />
        </section>
    );
}
