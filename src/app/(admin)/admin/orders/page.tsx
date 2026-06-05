"use client";

import { useEffect, useState } from "react";
import { fetchAdminOrdersAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { ShoppingCart, Package, Truck, CheckCircle2, Search, Filter } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            try {
                const { data, error } = await fetchAdminOrdersAction();

                if (data && !error) {
                    setOrders(data);
                } else if (error) {
                    console.error("Failed to fetch orders from action", error);
                }
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const filteredOrders = orders.filter(order =>
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Order Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track and manage your store&apos;s sales and shipping status.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                        />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Items</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Total</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                            <span>Loading orders...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShoppingCart className="w-12 h-12 opacity-10" />
                                            <p>No orders found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(order.created_at), "MMM d, yyyy")}
                                            <div className="text-[10px] text-gray-400 mt-0.5">at {format(new Date(order.created_at), "HH:mm")}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                                {order.user_email.split('@')[0] || "Guest Customer"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {order.user_email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {Array.isArray(order.items) && order.items.slice(0, 2).map((item: any, i: number) => (
                                                    <span key={i} className="text-xs text-gray-600 flex items-center gap-2">
                                                        <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">{item.quantity}</span>
                                                        {item.name}
                                                    </span>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <span className="text-[10px] text-indigo-600 font-medium">+{order.items.length - 2} more items</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-black text-gray-900">
                                            €{Number(order.amount).toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-sm">
                                                View Full Order
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
