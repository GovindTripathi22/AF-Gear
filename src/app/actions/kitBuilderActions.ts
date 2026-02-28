"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function saveDesignAction(data: {
    sportId: string;
    designName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: any;
}) {
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
        design_name: data.designName,
        sport_id: data.sportId,
        settings: data.settings,
    });

    if (error) {
        console.error("Error saving design:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/admin/saved-designs");

    return { success: true };
}

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
    const supabase = await createClient();

    // Check if user is signed in (optional for inquiries)
    const user = await currentUser();
    const userId = user?.id || "anonymous";
    const userName = data.fullName;
    const userEmail = data.email;

    const { error } = await supabase.from("saved_designs").insert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        design_name: `Kit Inquiry - ${data.clubName || data.fullName} (${data.sportName})`,
        sport_id: data.sportId,
        settings: {
            type: "inquiry",
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            clubName: data.clubName,
            teamLevel: data.teamLevel,
            quantity: data.quantity,
            preferredColors: data.preferredColors,
            requirements: data.requirements,
        },
    });

    if (error) {
        console.error("Error submitting kit inquiry:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/saved-designs");

    return { success: true };
}
