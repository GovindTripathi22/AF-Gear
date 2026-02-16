"use client";

import { motion } from "framer-motion";

interface CollectionCardProps {
    title: string;
    subtitle: string;
    image: string;
    accentColor?: string;
}

function CollectionCard({ title, subtitle, image, accentColor = "var(--color-primary)" }: CollectionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-[0_2px_12px_var(--color-shadow)]"
        >
            {/* Background Image */}
            <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <p
                    className="text-xs uppercase tracking-[0.2em] mb-2 font-medium"
                    style={{ color: accentColor }}
                >
                    {subtitle}
                </p>
                <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-wide">
                    {title}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-white/70 text-sm group-hover:text-white transition-colors">
                    <span>View Products</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
            </div>
        </motion.div>
    );
}

export function CollectionsShowcase() {
    const collections = [
        {
            title: "CLUB",
            subtitle: "Before Everything",
            image: "/assets/club-1.png",
            accentColor: "var(--color-primary)"
        },
        {
            title: "GAEILGE",
            subtitle: "Heritage Collection",
            image: "/assets/irish-1.png",
            accentColor: "#FFFFFF"
        },
        {
            title: "LIMERICK",
            subtitle: "Treaty City",
            image: "/assets/limerick-1.png",
            accentColor: "var(--color-primary)"
        },
        {
            title: "TIPPERARY",
            subtitle: "Premier County",
            image: "/assets/tipperary-1.png",
            accentColor: "var(--color-primary)"
        }
    ];

    return (
        <section className="py-16 md:py-24 px-4 md:px-8 bg-background-elevated">
            <div className="max-w-[1600px] mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wide">
                        The Collections
                    </h2>
                    <p className="mt-2 text-muted text-sm tracking-wide">
                        Select a category to explore the elite range.
                    </p>
                </motion.div>

                {/* Collections Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {collections.map((collection) => (
                        <CollectionCard
                            key={collection.title}
                            {...collection}
                        />
                    ))}
                </div>

                {/* Bottom description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 relative overflow-hidden rounded-2xl border border-primary/30"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background-elevated to-background-card" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">🇮🇪</span>
                                <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">
                                    Promote <span className="text-primary text-glow">Gaeilge</span>
                                </h3>
                            </div>

                            <p className="text-muted text-lg leading-relaxed">
                                Wear the language with pride. We create <strong className="text-white">custom Irish language jerseys</strong> for schools and clubs, complete with your crest and Gaeilge text.
                                <span className="block mt-2 text-primary/80 text-sm font-bold uppercase tracking-widest">
                                    Perfect for Seachtain na Gaeilge & Club Identity
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 min-w-max">
                            <a href="/contact" className="px-8 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_25px_var(--color-primary-glow)] rounded-sm inline-block text-center">
                                Get a Quote
                            </a>
                            <p className="text-center text-[10px] text-muted uppercase tracking-widest">
                                Special Rates for Schools
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
