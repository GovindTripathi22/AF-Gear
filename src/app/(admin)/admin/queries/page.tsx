"use client";

import { useEffect, useState } from "react";
import { fetchAdminQueriesAction, markQueryReadAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { MessageSquare, Mail, User, CheckCircle2, Search, Inbox } from "lucide-react";

export default function AdminQueriesPage() {
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchQueries() {
            try {
                const { data, error } = await fetchAdminQueriesAction();

                if (data && !error) {
                    setQueries(data);
                } else if (error) {
                    console.error("Failed to fetch queries", error);
                }
            } catch (err) {
                console.error("Failed to fetch queries", err);
            } finally {
                setLoading(false);
            }
        }

        fetchQueries();
    }, []);

    const markAsRead = async (id: string) => {
        const { success } = await markQueryReadAction(id);

        if (success) {
            setQueries(queries.map(q => q.id === id ? { ...q, status: 'read' } : q));
        }
    };

    const filteredQueries = queries.filter(query =>
        query.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        if (status === 'unread') {
            return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded text-xs font-bold uppercase">Unread</span>;
        }
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-xs font-bold uppercase">Read</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Contact Queries
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View and manage messages from your customers.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Sender</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Subject</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Message</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 min-w-24">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        Loading messages...
                                    </td>
                                </tr>
                            ) : filteredQueries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Inbox className="w-12 h-12 opacity-10" />
                                            <p>No messages found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredQueries.map((query) => (
                                    <tr key={query.id} className={`transition-colors group ${query.status === 'unread' ? 'bg-indigo-50/10' : 'hover:bg-gray-50/50'}`}>
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(query.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                <User className="w-3 h-3 text-gray-400" />
                                                {query.user_name}
                                            </div>
                                            <div className="text-xs text-indigo-600 flex items-center gap-2 mt-1">
                                                <Mail className="w-3 h-3" />
                                                <a href={`mailto:${query.user_email}`} className="hover:underline">{query.user_email}</a>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900 capitalize">
                                            {query.subject?.replace("-", " ") || "No Subject"}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={query.message}>
                                            {query.message}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(query.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            {query.status === 'unread' && (
                                                <button
                                                    onClick={() => markAsRead(query.id)}
                                                    className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 text-xs font-bold uppercase flex items-center justify-end gap-1 w-full"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> Mark Read
                                                </button>
                                            )}
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
