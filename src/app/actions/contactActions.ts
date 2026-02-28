"use server";

import { createClient } from "@/utils/supabase/server";

export async function submitContactQueryAction(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    if (!data.name || !data.email || !data.message) {
        return { success: false, error: "Name, email, and message are required." };
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contact_queries").insert({
        user_name: data.name,
        user_email: data.email,
        subject: data.subject || "No Subject",
        message: data.message,
    });

    if (error) {
        console.error("Error submitting contact query:", error);
        return { success: false, error: "Failed to send message. Please try again." };
    }

    return { success: true };
}
