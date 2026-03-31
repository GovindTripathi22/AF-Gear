"use server";

import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkServerActionRate } from "@/utils/serverRateLimit";

// Ensure environments variables for Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role client to bypass RLS for inserting reservations
const createAdminClient = () => {
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

export async function reserveProduct({
    productId,
    productName,
    size,
    quantity
}: {
    productId: string | number;
    productName: string;
    size: string;
    quantity: number;
}) {
    const { blocked } = await checkServerActionRate("reserve", 5, 60_000);
    if (blocked) {
        return { error: "Too many requests. Please wait a moment." };
    }

    try {
        const user = await currentUser();
        if (!user) {
            return { error: "You must be logged in to reserve an item." };
        }

        const supabase = createAdminClient();

        // Use primary email address
        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            return { error: "User email not found." };
        }

        const { data, error } = await supabase
            .from("product_reservations")
            .insert({
                product_id: productId.toString(),
                product_name: productName,
                user_id: user.id,
                user_email: userEmail,
                size,
                quantity,
                status: "reserved"
            })
            .select()
            .single();

        if (error) {
            console.error("Error inserting reservation:", error);
            return { error: "Failed to reserve the item. Please try again." };
        }

        revalidatePath(`/products/${productId}`);

        return { success: true, data };
    } catch (err: unknown) {
        console.error("Reserve Exception:", err);
        return { error: "An unexpected error occurred." };
    }
}
