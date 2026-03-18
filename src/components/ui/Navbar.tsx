"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, ChevronDown, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> target/main
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "./ThemeProvider";
import { AuthButtons } from "./AuthButtons";
import { GlobalSearch } from "./GlobalSearch";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Shield } from "lucide-react";

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
    const [searchOpen, setSearchOpen] = useState(false);
    const { scrollY } = useScroll();
    const { items, setIsOpen } = useCart();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const { user } = useUser();
<<<<<<< HEAD
    const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin';
=======
    const isAdmin = user?.primaryEmailAddress?.emailAddress === "govindtriapthi3@gmail.com";
>>>>>>> target/main

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
        { name: "TRACK ORDER", href: "/track-order" },
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
                className="sticky top-0 z-50 w-full"
            >
                {/* Announcement Bar — inside Navbar so it hides/shows with it */}
                <div className="bg-black border-b border-white/10 text-center py-2">
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                        Free Shipping on Orders Over €100 — <span className="text-primary">AF Gear</span> Premium Teamwear
                    </p>
                </div>
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
<<<<<<< HEAD
                                <Image src="/assets/af-logo.png" alt="AF Gear" width={40} height={40} className="h-10 w-auto" />
=======
                                <img src="/assets/af-logo.png" alt="AF Gear" className="h-10 w-auto" />
>>>>>>> target/main
                            </Link>
                        </div>

                        {/* LEFT: Logo (Desktop) */}
                        <Link href="/" className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2">
<<<<<<< HEAD
                            <Image src="/assets/af-logo.png" alt="AF Gear" width={80} height={80} className="h-16 lg:h-20 w-auto transition-transform hover:scale-105 duration-300" />
=======
                            <img src="/assets/af-logo.png" alt="AF Gear" className="h-16 lg:h-20 w-auto transition-transform hover:scale-105 duration-300" />
>>>>>>> target/main
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
                            <button onClick={() => setSearchOpen(true)} className="text-white hover:text-primary transition-colors p-2 hidden sm:block">
                                <Search className="w-5 h-5" />
                            </button>

                            <AuthButtons />
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
<<<<<<< HEAD
                                <Image src="/assets/af-logo.png" alt="AF Gear" width={40} height={40} className="h-10 w-auto" />
=======
                                <img src="/assets/af-logo.png" alt="AF Gear" className="h-10 w-auto" />
>>>>>>> target/main
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
                                <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    <Search className="w-4 h-4" /> Search
                                </button>
                                <SignedIn>
                                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                        <User className="w-4 h-4" /> My Profile
                                    </Link>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:text-white hover:bg-primary/20 bg-primary/10 rounded-lg transition-all border border-primary/20">
                                            <Shield className="w-4 h-4" /> Admin Panel
                                        </Link>
                                    )}
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                            <User className="w-4 h-4" /> Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                    {isDark ? "Dark Mode" : "Light Mode"}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
