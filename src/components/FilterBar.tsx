"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { Shirt, Home, MapPin, GraduationCap } from "lucide-react";

interface FilterBarProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
}

const FILTERS = [
    { id: "All", label: "All Teams", icon: null },
    { id: "Club", label: "Home Kit", icon: Home },
    { id: "Limerick", label: "Away Kit", icon: MapPin },
    { id: "Tipperary", label: "Training", icon: GraduationCap },
];

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
    return (
        <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="sticky top-4 z-30 w-full flex justify-center py-4 pointer-events-none"
        >
            <div className="pointer-events-auto bg-background-card/90 backdrop-blur-2xl border border-border rounded-full px-2 py-2 flex gap-1 shadow-[0_4px_30px_var(--color-shadow)]">
                {FILTERS.map((filter) => {
                    const isActive = currentFilter === filter.id;
                    const Icon = filter.icon;

                    return (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id)}
                            className={clsx(
                                "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer",
                                isActive
                                    ? "text-black"
                                    : "text-muted hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeFilterPill"
                                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_20px_var(--color-primary-glow)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            )}

                            {Icon && (
                                <span className="relative z-10">
                                    <Icon size={16} />
                                </span>
                            )}

                            <span className="relative z-10">{filter.label}</span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
