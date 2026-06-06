import { createAdminClient } from "@/utils/supabase/admin";
import { format } from "date-fns";
import { Package, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
    const supabase = createAdminClient();

    let reservations: any = null;
    let error = null;

    if (supabase) {
        try {
            const { data, error: fetchError } = await supabase
                .from("product_reservations")
                .select("*")
                .order("created_at", { ascending: false });
            reservations = data;
            error = fetchError;
        } catch (e) {
            error = e;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-indigo-600" />
                        Product Reservations
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor group-order reservations. Items go into production once minimum thresholds are met.
                    </p>
                </div>

                {/* Filters - Visual Only for now */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reservations..."
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Reservations List */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {error ? (
                    <div className="p-8 text-center text-red-600 bg-red-50 m-4 rounded-lg border border-red-200">
                        Error loading reservations. Ensure database tables exist.
                    </div>
                ) : !reservations || reservations.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <Package className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase mb-2">No Reservations Yet</h3>
                        <p className="text-sm text-gray-500">
                            When customers reserve &quot;Coming Soon&quot; or pre-order products, they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Customer Details</th>
                                    <th className="px-6 py-4">Specs</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reservations.map((reservation: any) => (
                                    <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">{reservation.product_name}</div>
                                            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">
                                                ID: {reservation.product_id?.split('-')[0]}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                                {reservation.user_email?.split('@')[0] || "Guest"}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {reservation.user_email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded text-gray-700 text-xs font-medium">
                                                    Size: {reservation.size}
                                                </span>
                                                <span className="text-gray-500 text-xs">
                                                    Qty: <strong className="text-gray-900 font-bold">{reservation.quantity}</strong>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                                                {reservation.status || 'Reserved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(reservation.created_at), 'MMM d, yyyy')}
                                            <div className="text-[10px] text-gray-400 mt-0.5">
                                                {format(new Date(reservation.created_at), 'HH:mm')}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
