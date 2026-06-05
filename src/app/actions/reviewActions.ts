"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { z } from "zod";

const ReviewSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1, "Comment is required").max(1000, "Comment is too long"),
});
export async function submitReviewAction(data: {
    productId: string;
    rating: number;
    comment: string;
}) {
    const parsed = ReviewSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation error" };
    }
    const validatedData = parsed.data;
    const user = await currentUser();

    if (!user) {
        return { success: false, error: "You must be signed in to leave a review." };
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("reviews").insert({
        product_id: validatedData.productId,
        user_id: user.id,
        user_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        rating: validatedData.rating,
        comment: validatedData.comment,
    });

    if (error) {
        console.error("Error submitting review:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/products/${data.productId}`);
    return { success: true };
}
