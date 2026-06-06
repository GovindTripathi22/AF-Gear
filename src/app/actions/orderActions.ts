"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function trackOrderAction(orderReference: string) {
    if (!orderReference || !orderReference.trim()) {
        return { data: null, error: "Order reference is required" };
    }

    const supabase = createAdminClient();
    if (!supabase) {
        return { data: null, error: "Database connection failed" };
    }

    // Check if searching by full UUID/reference or suffix
    const query = orderReference.length > 20
        ? supabase.from("orders").select("*").eq("order_reference", orderReference).maybeSingle()
        : supabase.from("orders").select("*").ilike("order_reference", `%${orderReference}`).maybeSingle();

    const { data, error } = await query;

    if (error) {
        return { data: null, error: error.message };
    }

    return { data, error: null };
}
