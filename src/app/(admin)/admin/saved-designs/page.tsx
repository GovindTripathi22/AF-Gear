"use client";

import { useEffect, useState } from "react";
import { fetchAdminSavedDesignsAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { Download, Eye } from "lucide-react";

export default function AdminSavedDesignsPage() {
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllDesigns() {
            try {
                const { data, error } = await fetchAdminSavedDesignsAction();
                if (data && !error) {
                    setDesigns(data);
                } else if (error) {
                    console.error("Failed to fetch designs", error);
                }
            } catch (err) {
                console.error("Failed to fetch all designs", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAllDesigns();
    }, []);

    const exportToCsv = () => {
        const headers = ["ID", "User Name", "Email", "Design Name", "Sport", "Date"];
        const rows = designs.map(d => [
            d.id,
            d.user_name || 'N/A',
            d.user_email || 'N/A',
            `"${d.design_name}"`,
            d.sport_id,
            format(new Date(d.created_at), "yyyy-MM-dd HH:mm")
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "saved_designs.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">
                        Saved Custom Designs
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        View all kit designs saved by customers.
                    </p>
                </div>
                {designs.length > 0 && (
                    <button
                        onClick={exportToCsv}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                )}
            </div>

            <div className="bg-background-elevated border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/40">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Sport</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Design Name</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted">Details</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted">
                                        Loading designs...
                                    </td>
                                </tr>
                            ) : designs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted">
                                        No designs saved yet.
                                    </td>
                                </tr>
                            ) : (
                                designs.map((design) => (
                                    <tr key={design.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-white/70 whitespace-nowrap">
                                            {format(new Date(design.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-white leading-tight">
                                                {design.user_name || "Guest User"}
                                            </div>
                                            <div className="text-xs text-muted">
                                                {design.user_email || "No Email"}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-white/90 capitalize whitespace-nowrap">
                                            {design.sport_id.replace("-", " ")}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-white">
                                            {design.design_name}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-muted border border-white/10 px-2 py-0.5 rounded w-fit">
                                                    Pattern: {design.settings?.pattern || "Unknown"}
                                                </span>
                                                <span className="text-[10px] text-muted border border-white/10 px-2 py-0.5 rounded w-fit">
                                                    Colors: {Object.keys(design.settings?.colors || {}).length}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                className="text-primary hover:text-white transition-colors p-2"
                                                title="View Raw JSON (Dev Tool)"
                                                onClick={() => alert(`JSON Configuration:\n\n${JSON.stringify(design.settings, null, 2)}`)}
                                            >
                                                <Eye className="w-4 h-4" />
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
