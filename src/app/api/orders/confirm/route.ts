import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendOrderConfirmationEmail } from "@/utils/email";

import { z } from "zod";

const ConfirmSchema = z.object({
    sessionId: z.string().regex(/^cs_/, "Invalid session ID format"),
});

export async function POST(req: Request) {
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = ConfirmSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { sessionId } = parsed.data;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret, {
        apiVersion: "2024-12-18.acacia" as any,
    });

    try {
        // 1. Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "payment_intent"],
        });

        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Order not paid" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 2. Check if order already exists
        const { data: existingOrder } = await supabase
            .from("orders")
            .select("id")
            .eq("stripe_session_id", sessionId)
            .single();

        if (existingOrder) {
            return NextResponse.json({ success: true, message: "Order already recorded." });
        }

        // 3. Extract order data
        const items = session.line_items?.data.map(item => ({
            title: item.description,
            quantity: item.quantity,
            amount: (item.amount_total || 0) / 100,
        })) || [];

        const totalAmount = (session.amount_total || 0) / 100;
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;
        const customerId = session.metadata?.userId || null; // Might be useful if passed in checkout

        // 4. Record order in Supabase
        const { error: insertError } = await supabase.from("orders").insert({
            stripe_session_id: sessionId,
            user_id: customerId,
            user_email: customerEmail,
            amount: totalAmount,
            items: items,
            status: "processing",
        });

        if (insertError) {
            console.error("Supabase Order Insert Error:", insertError);
            return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
        }

        // 5. Send Email
        const orderData = {
            customer_email: customerEmail,
            customer_name: customerName,
            total_amount: totalAmount,
            items,
            stripe_session_id: sessionId
        };
        await sendOrderConfirmationEmail(orderData);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Order Confirmation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
