"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function trackOrderAction(orderRef: string, email: string) {
    if (!orderRef || !orderRef.trim()) {
        return { data: null, error: "Order ID is required" };
    }
    if (!email || !email.trim()) {
        return { data: null, error: "Email is required" };
    }

    const supabase = createAdminClient();
    if (!supabase) {
        return { data: null, error: "Database connection failed" };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOrderRef = orderRef.trim();

    // Support both full order references and suffixes (short forms)
    const query = cleanOrderRef.length > 20
        ? supabase
            .from("orders")
            .select("*")
            .eq("order_reference", cleanOrderRef)
            .eq("user_email", normalizedEmail)
        : supabase
            .from("orders")
            .select("*")
            .ilike("order_reference", `%${cleanOrderRef}%`)
            .eq("user_email", normalizedEmail);

    const { data, error } = await query.maybeSingle();

    if (error) {
        return { data: null, error: error.message };
    }

    return { data, error: null };
}
