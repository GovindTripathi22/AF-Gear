"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const SHOP_COLLECTIONS = [
    { name: "Club Teamwear", href: "/#club" },
    { name: "Limerick Collection", href: "/#limerick" },
    { name: "Tipperary Collection", href: "/#tipperary" },
    { name: "Irish Language Range", href: "/#irish" },
    { name: "School Uniforms", href: "/school-uniforms" },
];

export function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const { scrollY } = useScroll();
    const { items, setIsOpen } = useCart();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const links = [
        { name: "HOME", href: "/" },
        { name: "ABOUT", href: "/about" },
        { name: "CONTACT", href: "/contact" },
    ];

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="sticky top-0 z-40 w-full"
        >
            <div className="bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

                    {/* LEFT: Mobile Menu & Logo (Mobile) */}
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-white hover:text-primary transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="md:hidden">
                            <img src="/assets/af-logo.png" alt="AF Gear" className="h-12 w-auto" />
                        </Link>
                    </div>

                    {/* LEFT: Logo (Desktop) */}
                    <Link href="/" className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2">
                        <img src="/assets/af-logo.png" alt="AF Gear" className="h-20 w-auto transition-transform hover:scale-105 duration-300" />
                    </Link>

                    {/* CENTER: Navigation Links (Desktop) */}
                    <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold tracking-widest text-white/70 hover:text-primary transition-colors uppercase relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}

                        {/* SHOP dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setShopOpen(true)}
                            onMouseLeave={() => setShopOpen(false)}
                        >
                            <button className="text-sm font-bold tracking-widest text-white/70 hover:text-primary transition-colors uppercase relative group flex items-center gap-1">
                                SHOP
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`} />
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                            </button>

                            <AnimatePresence>
                                {shopOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-background-elevated/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                                    >
                                        <div className="py-2">
                                            {SHOP_COLLECTIONS.map((collection) => (
                                                <Link
                                                    key={collection.name}
                                                    href={collection.href}
                                                    className="block px-5 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                                                >
                                                    {collection.name}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="border-t border-white/5 px-5 py-3">
                                            <Link href="/#shop" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                                                View All Products →
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* RIGHT: Icons */}
                    <div className="flex items-center gap-4 ml-auto">
                        <button className="text-white hover:text-primary transition-colors p-2 hidden sm:block">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-primary transition-colors p-2">
                            <User className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="text-white hover:text-primary transition-colors p-2 relative group"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black group-hover:scale-110 transition-transform">
                                    {items.length}
                                </span>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </motion.header>
    );
}
