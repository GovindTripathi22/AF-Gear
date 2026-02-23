import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/contexts/CartContext';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    const defaultSecret = process.env.STRIPE_SECRET_KEY;
    if (!defaultSecret) {
        return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
    }

    const stripe = new Stripe(defaultSecret, {
        apiVersion: '2026-01-28.clover',
    });

    try {
        const { items } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Create line items for Stripe Checkout
        const lineItems = items.map((item: CartItem) => {
            // Parse price cleanly just in case there are symbols
            let priceNum = 0;
            if (typeof item.price === "string") {
                priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
            } else if (typeof item.price === "number") {
                priceNum = item.price;
            }

            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `${item.title} (${item.size})`,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(priceNum * 100), // Stripe uses cents 
                },
                quantity: item.quantity,
            };
        });

        // The domain name depends on if we are in local dev or production Vercel
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['IE', 'GB', 'US', 'AU'], // Allow common AF-Gear shipping locations
            }
        });

        // Save pending order to database
        const supabase = await createClient();
        if (supabase) {
            const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
            // The user's email is not known until they checkout, so we use a placeholder that the webhook fixes
            await supabase.from('orders').insert({
                stripe_session_id: session.id,
                user_email: 'pending_checkout',
                amount: amountTotal || lineItems.reduce((acc: number, item: any) => acc + (item.price_data?.unit_amount || 0) * (item.quantity ?? 1), 0) / 100,
                items: items,
                status: 'pending'
            });
        }

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error("Stripe API Error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: (error as Error).message || "Failed to create Stripe session" }, { status: 500 });
    }
}
