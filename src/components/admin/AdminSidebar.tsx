"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Package,
    LayoutDashboard,
    FileText,
    LogOut,
    ShoppingCart,
    Star,
    MessageSquare,
    Bookmark,
    Pencil,
    Menu,
    X,
    CalendarCheck,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/queries", label: "Queries", icon: MessageSquare },
    { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
    { href: "/admin/content", label: "Content", icon: Pencil },
    { href: "/admin/saved-designs", label: "Query Forms", icon: Bookmark },
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

    const sidebarContent = (
        <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center justify-between flex-shrink-0 px-6">
                <div className="flex items-center">
                    <span className="text-2xl font-black tracking-tight text-indigo-600">AF-Gear</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600">
                        Admin
                    </span>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={() => setOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${active
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            <item.icon
                                className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                                    }`}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Logout */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4 mt-auto">
                <div className="flex items-center justify-between w-full">
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
                        {userEmail || "Guest Admin"}
                    </p>
                    <form action={signoutAction}>
                        <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            {/* Mobile top bar */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center gap-3 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <span className="text-lg font-bold tracking-tight text-indigo-600">AF-Gear</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600">
                    Admin
                </span>
            </div>

            {/* Overlay (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar — desktop: always visible | mobile: slide-in drawer */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-xl
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
