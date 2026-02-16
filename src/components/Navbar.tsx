"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const SHOP_COLLECTIONS = [
    { name: "Club Teamwear", href: "/collections/club" },
    { name: "Limerick Collection", href: "/collections/limerick" },
    { name: "Tipperary Collection", href: "/collections/tipperary" },
    { name: "Irish Language Range", href: "/collections/irish" },
    { name: "School Uniforms", href: "/school-uniforms" },
];

export function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileShopOpen, setMobileShopOpen] = useState(false);
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
        { name: "KIT BUILDER", href: "/kit-builder" },
        { name: "CONTACT", href: "/contact" },
    ];

    return (
        <>
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
                    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">

                        {/* LEFT: Mobile Menu & Logo (Mobile) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden text-white hover:text-primary transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link href="/" className="md:hidden">
                                <img src="/assets/af-logo.svg" alt="AF Gear" className="h-10 w-auto dark:invert" />
                            </Link>
                        </div>

                        {/* LEFT: Logo (Desktop) */}
                        <Link href="/" className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2">
                            <img src="/assets/af-logo.svg" alt="AF Gear" className="h-16 lg:h-20 w-auto transition-transform hover:scale-105 duration-300 dark:invert" />
                        </Link>

                        {/* CENTER: Navigation Links (Desktop) */}
                        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-4 lg:gap-8">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs lg:text-sm font-bold tracking-widest text-white/70 hover:text-primary transition-colors uppercase relative group whitespace-nowrap"
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
                                <button className="text-xs lg:text-sm font-bold tracking-widest text-white/70 hover:text-primary transition-colors uppercase relative group flex items-center gap-1">
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
                                                        onClick={() => setShopOpen(false)}
                                                        className="block px-5 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                                                    >
                                                        {collection.name}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="border-t border-white/5 px-5 py-3">
                                                <Link
                                                    href="/#shop"
                                                    onClick={() => setShopOpen(false)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
                                                >
                                                    View All Products →
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        {/* RIGHT: Icons */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                            <button className="text-white hover:text-primary transition-colors p-2 hidden sm:block">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="text-white hover:text-primary transition-colors p-2 hidden sm:block">
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

            {/* ────── MOBILE MENU DRAWER ────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-background border-r border-white/10 z-50 flex flex-col overflow-y-auto"
                        >
                            {/* Close + Logo */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <img src="/assets/af-logo.svg" alt="AF Gear" className="h-10 w-auto dark:invert" />
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="text-white hover:text-primary transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-col py-4">
                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-white/80 hover:text-primary hover:bg-white/5 transition-all border-b border-white/5"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {/* Shop Accordion */}
                                <button
                                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                                    className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-white/80 hover:text-primary hover:bg-white/5 transition-all border-b border-white/5 flex items-center justify-between"
                                >
                                    SHOP
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileShopOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {mobileShopOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden bg-white/5"
                                        >
                                            {SHOP_COLLECTIONS.map((collection) => (
                                                <Link
                                                    key={collection.name}
                                                    href={collection.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="block px-8 py-3 text-xs font-medium text-muted hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    {collection.name}
                                                </Link>
                                            ))}
                                            <Link
                                                href="/#shop"
                                                onClick={() => setMobileOpen(false)}
                                                className="block px-8 py-3 text-xs font-bold text-primary hover:text-white transition-all"
                                            >
                                                View All Products →
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </nav>

                            {/* Bottom Actions */}
                            <div className="mt-auto p-6 border-t border-white/10 space-y-3">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    <Search className="w-4 h-4" /> Search
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    <User className="w-4 h-4" /> Account
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
