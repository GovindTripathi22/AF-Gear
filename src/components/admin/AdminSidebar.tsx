"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Package,
    LayoutDashboard,
    LogOut,
    ShoppingCart,
    Star,
    MessageSquare,
    Bookmark,
    Pencil,
    Menu,
    X,
    CalendarCheck,
    Tags,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/admin",             label: "Dashboard",    icon: LayoutDashboard },
    { href: "/admin/products",    label: "Products",     icon: Package },
    { href: "/admin/categories",  label: "Categories",   icon: Tags },
    { href: "/admin/orders",      label: "Orders",       icon: ShoppingCart },
    { href: "/admin/reviews",     label: "Reviews",      icon: Star },
    { href: "/admin/queries",     label: "Queries",      icon: MessageSquare },
    { href: "/admin/reservations",label: "Reservations", icon: CalendarCheck },
    { href: "/admin/content",     label: "Content",      icon: Pencil },
    { href: "/admin/saved-designs",label: "Query Forms", icon: Bookmark },
];

interface AdminSidebarProps {
    userEmail: string | null;
    signoutAction: () => Promise<void>;
}

export default function AdminSidebar({ userEmail, signoutAction }: AdminSidebarProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const navLinks = (
        <nav className="mt-6 flex-1 px-3 space-y-0.5">
            {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                            active
                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                        <item.icon
                            className={`flex-shrink-0 h-5 w-5 transition-colors ${
                                active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                            }`}
                        />
                        <span className="truncate">{item.label}</span>
                        {active && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    const sidebarContent = (
        <div className="h-full flex flex-col pt-5 pb-4">
            {/* Logo */}
            <div className="flex items-center justify-between flex-shrink-0 px-5 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-indigo-600">AF-Gear</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700">
                        Admin
                    </span>
                </div>
                {/* Close — mobile only */}
                <button
                    onClick={() => setOpen(false)}
                    className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-5 mb-2" />

            {/* Nav */}
            <div className="flex-1 overflow-y-auto">{navLinks}</div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-100 px-5 pt-4 mt-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {userEmail || "Admin"}
                        </p>
                    </div>
                    <form action={signoutAction}>
                        <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                            title="Sign out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Mobile top bar ── */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center gap-3 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Open navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <span className="text-lg font-black tracking-tight text-indigo-600">AF-Gear</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600">
                    Admin
                </span>

                {/* Quick nav pills — visible on mobile without opening menu */}
                <div className="flex-1 overflow-x-auto ml-2">
                    <div className="flex items-center gap-1.5 min-w-max">
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                                        active
                                            ? "bg-indigo-100 text-indigo-700"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                                >
                                    <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Overlay (mobile) ── */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:z-auto
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
