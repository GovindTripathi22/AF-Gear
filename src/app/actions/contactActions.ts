"use server";

import { createAdminClient } from "@/utils/supabase/admin";

import { z } from "zod";

const ContactSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    subject: z.string().max(200).optional(),
    message: z.string().min(1, "Message is required").max(5000),
});
export async function submitContactQueryAction(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation error" };
    }
    const validatedData = parsed.data;

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact_queries").insert({
        user_name: validatedData.name,
        user_email: validatedData.email,
        subject: validatedData.subject || "No Subject",
        message: validatedData.message,
    });

    if (error) {
        console.error("Error submitting contact query:", error);
        return { success: false, error: "Failed to send message. Please try again." };
    }

    return { success: true };
}
