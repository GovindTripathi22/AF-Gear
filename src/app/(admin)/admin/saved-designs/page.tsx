"use client";

import { useEffect, useState } from "react";
import { fetchAdminSavedDesignsAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { Download, Eye, Inbox } from "lucide-react";

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
        link.setAttribute("download", "query_form_submissions.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Query Form Submissions
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View all inquiries and form submissions from customers.
                    </p>
                </div>
                {designs.length > 0 && (
                    <button
                        onClick={exportToCsv}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                )}
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Sport</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Form / Design Name</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Details</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        Loading designs...
                                    </td>
                                </tr>
                            ) : designs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Inbox className="w-12 h-12 opacity-10" />
                                            <p>No submissions yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                designs.map((design) => (
                                    <tr key={design.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(design.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                                {design.user_name || "Guest User"}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {design.user_email || "No Email"}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 capitalize whitespace-nowrap">
                                            {design.sport_id?.replace("-", " ") || "N/A"}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900">
                                            {design.design_name}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded w-fit bg-gray-50">
                                                    Pattern: {design.settings?.pattern || "Unknown"}
                                                </span>
                                                <span className="text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded w-fit bg-gray-50">
                                                    Colors: {Object.keys(design.settings?.colors || {}).length}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-800 transition-colors p-2"
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
