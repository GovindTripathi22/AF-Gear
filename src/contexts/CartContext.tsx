"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    id: string | number;
    title: string;
    price: string | number;
    image?: string;
    category?: string;
    size: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string | number, size: string) => void;
    updateQuantity: (id: string | number, size: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from local storage if needed
    useEffect(() => {
        const savedCart = localStorage.getItem("af-gear-cart");
        if (savedCart) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(savedCart) as CartItem[]);
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem("af-gear-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems((prev) => {
            const existingItem = prev.find(
                (item) => item.id === newItem.id && item.size === newItem.size
            );
            if (existingItem) {
                return prev.map((item) =>
                    item.id === newItem.id && item.size === newItem.size
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, newItem];
        });
        setIsOpen(true); // Open cart when adding
    };

    const removeFromCart = (id: string | number, size: string) => {
        setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id: string | number, size: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id, size);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === id && item.size === size ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => {
        let price = 0;
        if (typeof item.price === "string") {
            price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        } else if (typeof item.price === "number") {
            price = item.price;
        }
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                isOpen,
                setIsOpen,
                isLoaded,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
