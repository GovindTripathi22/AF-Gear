"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, User, Sun, Moon, LucideIcon } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

function DockItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={ref}
            whileHover={{ scale: 1.2, y: -10 }}
            className="relative group cursor-pointer"
            onClick={onClick}
        >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-background-card/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-border shadow-lg group-hover:bg-background-elevated group-hover:border-primary group-hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all duration-300">
                <Icon className="text-muted group-hover:text-primary w-6 h-6 transition-colors" />
            </div>

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background text-primary text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-primary/30 pointer-events-none font-medium tracking-wide uppercase">
                {label}
            </span>
        </motion.div>
    );
}

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.div
            whileHover={{ scale: 1.2, y: -10 }}
            className="relative group cursor-pointer"
            onClick={toggleTheme}
        >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-background-card/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-border shadow-lg group-hover:bg-background-elevated group-hover:border-primary group-hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all duration-300 overflow-hidden">
                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                    {isDark ? (
                        <Moon className="text-primary w-6 h-6" />
                    ) : (
                        <Sun className="text-amber-500 group-hover:text-primary w-6 h-6 transition-colors" />
                    )}
                </motion.div>
            </div>

            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background text-primary text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-primary/30 pointer-events-none font-medium tracking-wide uppercase">
                {isDark ? "Light Mode" : "Dark Mode"}
            </span>
        </motion.div>
    );
}

export function Dock() {
    const { setIsOpen } = useCart();
    const router = useRouter();

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-background-card/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-2 shadow-lg z-50"
        >
            <DockItem icon={Home} label="Home" onClick={() => router.push("/")} />
            <DockItem icon={Search} label="Search" onClick={() => window.dispatchEvent(new CustomEvent("openSearch"))} />
            <DockItem icon={ShoppingBag} label="Cart" onClick={() => setIsOpen(true)} />
            <ThemeToggle />
        </motion.nav>
    );
}
