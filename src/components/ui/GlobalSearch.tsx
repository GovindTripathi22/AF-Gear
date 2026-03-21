"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchProducts } from "@/actions/search";
import type { Product } from "@/types";

export function GlobalSearch({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery("");
            setResults([]);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        if (!query) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResults([]);
            return;
        }

        setIsSearching(true);
        const delay = setTimeout(async () => {
            const data = await searchProducts(query);
            setResults(data);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-background-elevated border border-white/10 rounded-xl shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="flex items-center p-4 border-b border-white/10 relative">
                            <Search className="w-5 h-5 text-muted absolute left-6" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search products, collections..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-white placeholder:text-muted pl-10 pr-10 py-2 text-lg"
                            />
                            <button
                                onClick={onClose}
                                className="absolute right-4 text-muted hover:text-white p-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {isSearching ? (
                                <div className="flex items-center justify-center p-12 text-muted">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <div className="w-16 h-16 bg-white/5 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={product.images?.[0] || '/placeholder.png'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-primary font-medium tracking-wider">
                                                        {product.category}
                                                    </span>
                                                    <span className="text-muted text-xs">•</span>
                                                    <span className="text-white text-sm font-bold">
                                                        €{product.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <div className="p-3 text-center border-t border-white/5 mt-2">
                                        <Link
                                            href="/#shop"
                                            onClick={onClose}
                                            className="text-xs font-bold text-primary uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            View All Results →
                                        </Link>
                                    </div>
                                </div>
                            ) : query ? (
                                <div className="p-12 text-center text-muted">
                                    No products found for &quot;{query}&quot;. Try checking your spelling or using more generic terms.
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted text-sm space-y-4">
                                    <p className="font-bold uppercase tracking-widest text-[10px]">Popular Searches</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {["Jersey", "Hoodie", "Club", "Limerick", "Training"].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium transition-colors border border-white/5"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
