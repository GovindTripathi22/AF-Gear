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
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" />
                        Product Reservations
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        Monitor group-order reservations. Items go into production once minimum thresholds are met.
                    </p>
                </div>

                {/* Filters - Visual Only for now */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Search reservations..."
                            className="w-full bg-background-elevated border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <button className="p-2 bg-background-elevated border border-white/10 rounded-lg text-muted hover:text-white transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Reservations List */}
            <div className="bg-background-elevated border border-white/5 rounded-xl overflow-hidden">
                {error ? (
                    <div className="p-8 text-center text-red-500 bg-red-500/10 m-4 rounded-lg border border-red-500/20">
                        Error loading reservations. Ensure database tables exist.
                    </div>
                ) : !reservations || reservations.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <Package className="w-12 h-12 text-muted/30 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Reservations Yet</h3>
                        <p className="text-sm text-muted">
                            When customers reserve "Coming Soon" or pre-order products, they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 border-b border-white/10 text-muted uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Product</th>
                                    <th className="px-6 py-4 font-bold">Customer Details</th>
                                    <th className="px-6 py-4 font-bold">Specs</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reservations.map((reservation: any) => (
                                    <tr key={reservation.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{reservation.product_name}</div>
                                            <div className="text-xs text-muted mt-0.5 truncate max-w-[150px]">
                                                ID: {reservation.product_id?.split('-')[0]}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{reservation.user_email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white text-xs">
                                                    Size: {reservation.size}
                                                </span>
                                                <span className="text-muted text-xs">
                                                    Qty: <strong className="text-white">{reservation.quantity}</strong>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                {reservation.status || 'Reserved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted whitespace-nowrap">
                                            {format(new Date(reservation.created_at), 'MMM d, yyyy')}
                                            <div className="text-[10px] text-muted/60 mt-0.5">
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
