import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: Request) {
    // --- Require webhook secret (NEVER skip verification in production) ---
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('FATAL: Missing STRIPE_WEBHOOK_SECRET environment variable');
        return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
        );
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
        return NextResponse.json(
            { error: 'Stripe not configured' },
            { status: 500 }
        );
    }

    const stripe = new Stripe(stripeSecret, {
        apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
    });

    // --- Verify Signature (mandatory) ---
    const sig = req.headers.get('stripe-signature');
    if (!sig) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;
    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
        console.error('Webhook signature verification failed:', err instanceof Error ? err.message : err);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    const eventAge = Date.now() / 1000 - event.created;
    if (eventAge > 600) {
        console.warn("Rejected stale webhook event:", event.id);
        return NextResponse.json({ error: "Event too old" }, { status: 400 });
    }

    // --- Handle only expected event types ---
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const supabase = createAdminClient();

        // --- Idempotency check: skip if already processed ---
        const { data: existingOrders } = await supabase
            .from('orders')
            .select('id, status')
            .eq('stripe_session_id', session.id)
            .limit(1);

        if (existingOrders?.length && existingOrders[0].status === 'paid') {
            return NextResponse.json(
                { success: true, message: 'Already processed' },
                { status: 200 }
            );
        }

        // --- Update order to paid ---
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'paid',
                user_email: session.customer_details?.email || 'unknown@payment.com',
                user_id: session.metadata?.clerkUserId || null,
                paid_at: new Date().toISOString(),
            })
            .eq('stripe_session_id', session.id);

        if (updateError) {
            console.error('Error updating order in Supabase:', updateError);
            return NextResponse.json(
                { error: 'Database update failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({ received: true, status: 'paid' });
    }

    // --- Unhandled event types: acknowledge receipt but take no action ---
    return NextResponse.json({ received: true, status: 'ignored' });
}
