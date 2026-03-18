"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitReviewAction } from "@/app/actions/reviewActions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewSectionProps {
    productId: string;
    initialReviews: Review[];
    isSignedIn: boolean;
}

export function ReviewSection({ productId, initialReviews, isSignedIn }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn) {
            toast.error("Please sign in to leave a review");
            return;
        }

        setIsSubmitting(true);
        const result = await submitReviewAction({ productId, rating, comment });

        if (result.success) {
            toast.success("Review submitted! Thank you.");
            setComment("");
            setShowForm(false);
            // In a real app, revalidatePath handles this, but for instant UI:
            // (Mocking the new review locally)
            const newReview: Review = {
                id: Math.random().toString(),
                user_name: "You",
                rating,
                comment,
                created_at: new Date().toISOString(),
            };
            setReviews([newReview, ...reviews]);
        } else {
            toast.error(result.error || "Failed to submit review");
        }
        setIsSubmitting(false);
    };

    return (
        <section className="mt-24 border-t border-white/10 pt-16">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Stats Summary */}
                <div className="lg:w-1/3">
                    <h2 className="text-3xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                        Customer <span className="text-primary">Reviews</span>
                    </h2>

                    <div className="bg-background-elevated border border-white/5 rounded-2xl p-8 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                            <span className="text-6xl font-black text-white">{averageRating}</span>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-5 h-5 ${Number(averageRating) >= s ? 'fill-current' : 'text-white/20'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted mt-1">Based on {reviews.length} reviews</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-primary transition-all duration-300"
                        >
                            {showForm ? "Cancel Review" : "Write a Review"}
                        </button>
                    </div>
                </div>

                {/* Review Feed & Form */}
                <div className="lg:w-2/3">
                    <AnimatePresence>
                        {showForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Your Feedback</h3>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-3">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                className="transition-transform hover:scale-125"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${(hover || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-3">Comment</label>
                                    <textarea
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="bg-primary text-black font-black uppercase tracking-widest px-8 py-4 rounded-sm flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Posting..." : <>Post Review <Send className="w-4 h-4" /></>}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="space-y-8">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                <p className="text-muted">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            reviews.map((rev) => (
                                <motion.div
                                    layout
                                    key={rev.id}
                                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                                {rev.user_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white">{rev.user_name}</span>
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <span className="text-[10px] text-muted uppercase font-bold tracking-widest">
                                                    {formatDistanceToNow(new Date(rev.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-3 h-3 ${rev.rating >= s ? 'fill-current' : 'text-white/10'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/80 leading-relaxed italic border-l-2 border-primary/20 pl-4">
<<<<<<< HEAD
                                        &quot;{rev.comment}&quot;
=======
                                        "{rev.comment}"
>>>>>>> target/main
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
