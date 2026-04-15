"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const pubJerseys = [
    "/images/pub-jerseys/1000037870.jpg",
    "/images/pub-jerseys/1000037872.jpg",
    "/images/pub-jerseys/1000037874.jpg",
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
                            For Pubs & Communities
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-foreground mt-3 md:mt-4 leading-[0.9]"
                        >
                            THE NEW <br />
                            <span className="text-muted text-3xl sm:text-4xl md:text-6xl">CRAZE</span>
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
                                    <h4 className="text-foreground font-bold text-base md:text-lg lg:text-xl">Hugely Popular</h4>
                                    <p className="text-muted text-sm md:text-lg mt-1 md:mt-2">Pub Jerseys are all the new craze and have proven hugely popular amongst the pub goers.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1 flex-shrink-0">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-bold text-base md:text-lg lg:text-xl">Pub Owners</h3>
                                    <p className="text-muted text-sm md:text-lg mt-1 md:mt-2">If you&apos;re a pub owner and would like to discuss a design for your pub get in touch today!</p>
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
                                    Get In Touch
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Images Grid */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="order-1 lg:order-2 grid grid-cols-2 gap-2 sm:gap-4"
                    >
                        <div className="col-span-2 relative aspect-[4/3] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <Image
                                src={pubJerseys[0]}
                                alt="Pub Jersey Feature"
                                fill
                                className="object-cover object-center"
                            />
                            <div className="absolute inset-0 top-3 left-3 sm:top-6 sm:left-6 flex items-start pointer-events-none">
                                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-background-card/80 backdrop-blur-md border border-border text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full">
                                    Pub Collection
                                </span>
                            </div>
                        </div>
                        <div className="col-span-1 relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-white/10">
                            <Image
                                src={pubJerseys[1]}
                                alt="Pub Jersey Gallery 1"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        <div className="col-span-1 relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-white/10">
                            <Image
                                src={pubJerseys[2]}
                                alt="Pub Jersey Gallery 2"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Accent Glow */}
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />
        </section>
    );
}
