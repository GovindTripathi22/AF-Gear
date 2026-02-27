import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
    const defaultSecret = process.env.STRIPE_SECRET_KEY;
    if (!defaultSecret) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const stripe = new Stripe(defaultSecret, {
        apiVersion: "2026-01-28.clover",
    });

    const sig = req.headers.get("stripe-signature");
    // Depending on usage, STRIPE_WEBHOOK_SECRET should be in env. 
    // We bypass verify if missing and just trust the event type for safety demo if no secret exists
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        const bodyTxt = await req.text();
        if (webhookSecret && sig) {
            event = stripe.webhooks.constructEvent(bodyTxt, sig, webhookSecret);
        } else {
            // Unverified local usage
            event = JSON.parse(bodyTxt);
        }
    } catch (err: unknown) {
        console.error("Webhook Error", err);
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const supabase = createAdminClient();
        if (supabase) {
            const { error } = await supabase
                .from("orders")
                .update({
                    status: "paid",
                    user_email: session.customer_details?.email || "unknown@payment.com",
                    user_id: session.metadata?.clerkUserId || null
                })
                .eq("stripe_session_id", session.id);

            if (error) {
                console.error("Error updating order in Supabase:", error);
            }
        }
    }

    return NextResponse.json({ received: true });
}
