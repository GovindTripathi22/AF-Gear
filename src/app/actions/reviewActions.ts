"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function submitReviewAction(data: {
    productId: string;
    rating: number;
    comment: string;
}) {
    const user = await currentUser();

    if (!user) {
        return { success: false, error: "You must be signed in to leave a review." };
    }

    const supabase = await createClient();

    const { error } = await supabase.from("reviews").insert({
        product_id: data.productId,
        user_id: user.id,
        user_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        rating: data.rating,
        comment: data.comment,
    });

    if (error) {
        console.error("Error submitting review:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/products/${data.productId}`);
    return { success: true };
}
