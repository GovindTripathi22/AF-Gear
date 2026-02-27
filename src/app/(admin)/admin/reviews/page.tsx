"use client";

import { useEffect, useState } from "react";
import { fetchAdminReviewsAction, updateReviewStatusAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { MessageSquare, Star, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { data, error } = await fetchAdminReviewsAction();

                if (data && !error) {
                    setReviews(data);
                } else if (error) {
                    console.error("Failed to fetch reviews", error);
                }
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    const updateReviewStatus = async (id: string, status: string) => {
        const { success } = await updateReviewStatusAction(id, status);

        if (success) {
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'pending') {
            return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>;
        }
        if (status === 'approved') {
            return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-xs font-bold uppercase">Approved</span>;
        }
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase">Rejected</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Product Reviews
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Moderate customer reviews left on products.
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Product</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Rating & Comment</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        Loading reviews...
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <MessageSquare className="w-12 h-12 opacity-10" />
                                            <p>No reviews found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(review.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900">
                                            {review.products?.name || "Unknown Product"}
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">
                                            {review.user_name}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1 mb-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 max-w-sm">{review.comment}</p>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(review.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {review.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateReviewStatus(review.id, 'approved')}
                                                        className="text-emerald-600 hover:text-emerald-800 transition-colors p-2"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {review.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                        title="Reject"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
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
