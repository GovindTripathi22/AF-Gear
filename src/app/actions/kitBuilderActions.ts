"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

<<<<<<< HEAD
import { z } from "zod";

const SaveDesignSchema = z.object({
    sportId: z.string().min(1),
    designName: z.string().min(1).max(100),
    settings: z.any(),
});

export async function saveDesignAction(data: {
    sportId: string;
    designName: string;
     
    settings: any;
}) {
    const parsed = SaveDesignSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation err" };
    }
    const validatedData = parsed.data;
=======
export async function saveDesignAction(data: {
    sportId: string;
    designName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: any;
}) {
>>>>>>> target/main
    const user = await currentUser();

    if (!user) {
        return { success: false, error: "You must be signed in to save a design." };
    }

    const userId = user.id;
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const userEmail = user.emailAddresses[0]?.emailAddress || "no-email@example.com";

    const supabase = await createClient();

    const { error } = await supabase.from("saved_designs").insert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
<<<<<<< HEAD
        design_name: validatedData.designName,
        sport_id: validatedData.sportId,
        settings: validatedData.settings,
=======
        design_name: data.designName,
        sport_id: data.sportId,
        settings: data.settings,
>>>>>>> target/main
    });

    if (error) {
        console.error("Error saving design:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/admin/saved-designs");

    return { success: true };
}
<<<<<<< HEAD

const InquirySchema = z.object({
    sportId: z.string().min(1),
    sportName: z.string().min(1),
    fullName: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(20),
    clubName: z.string().max(100),
    teamLevel: z.string().max(50),
    quantity: z.string().max(10),
    preferredColors: z.string().max(100),
    requirements: z.string().max(2000),
});

export async function submitKitInquiry(data: {
    sportId: string;
    sportName: string;
    fullName: string;
    email: string;
    phone: string;
    clubName: string;
    teamLevel: string;
    quantity: string;
    preferredColors: string;
    requirements: string;
}) {
    const parsed = InquirySchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation error" };
    }
    const validatedData = parsed.data;

    const supabase = await createClient();

    // Check if user is signed in (optional for inquiries)
    const user = await currentUser();
    const userId = user?.id || "anonymous";
    const userName = data.fullName;
    const userEmail = data.email;

    const { error } = await supabase.from("saved_designs").insert({
        user_id: userId,
        user_name: validatedData.fullName,
        user_email: validatedData.email,
        design_name: `Kit Inquiry - ${validatedData.clubName || validatedData.fullName} (${validatedData.sportName})`,
        sport_id: validatedData.sportId,
        settings: {
            type: "inquiry",
            fullName: validatedData.fullName,
            email: validatedData.email,
            phone: validatedData.phone,
            clubName: validatedData.clubName,
            teamLevel: validatedData.teamLevel,
            quantity: validatedData.quantity,
            preferredColors: validatedData.preferredColors,
            requirements: validatedData.requirements,
        },
    });

    if (error) {
        console.error("Error submitting kit inquiry:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/saved-designs");

    return { success: true };
}
=======
>>>>>>> target/main
