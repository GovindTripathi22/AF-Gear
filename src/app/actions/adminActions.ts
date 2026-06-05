"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { ensureAdmin } from "@/utils/auth";

// ----------------- FETCH ACTIONS ----------------- //

export async function fetchAdminOrdersAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

export async function fetchAdminSavedDesignsAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("saved_designs")
        .select("*")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

export async function fetchAdminQueriesAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("contact_queries")
        .select("*")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

export async function fetchAdminReviewsAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("reviews")
        .select("*, products(name)")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

// ----------------- MUTATION ACTIONS ----------------- //

export async function markQueryReadAction(id: string) {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { success: false };

    const { error } = await supabase
        .from("contact_queries")
        .update({ status: "read" })
        .eq("id", id);

    if (!error) revalidatePath("/admin/queries");
    return { success: !error };
}

export async function updateReviewStatusAction(id: string, status: string) {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { success: false };

    const { error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id);

    if (!error) revalidatePath("/admin/reviews");
    return { success: !error };
}
