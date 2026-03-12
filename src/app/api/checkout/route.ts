import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/contexts/CartContext';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const CheckoutSchema = z.object({
    items: z.array(z.object({
        id: z.string().or(z.number()),
        title: z.string().min(1),
        price: z.union([z.number(), z.string()]),
        quantity: z.number().int().min(1).max(99),
        size: z.string().max(10),
        image: z.string().url().optional().or(z.literal("")),
    })).min(1, "Cart is empty"),
    customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    shippingMethod: z.enum(["standard", "express"]).default("standard"),
});

export async function POST(req: Request) {
    const defaultSecret = process.env.STRIPE_SECRET_KEY;
    if (!defaultSecret) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const stripe = new Stripe(defaultSecret, {
        apiVersion: '2026-01-28.clover' as any,
    });

    try {
        const body = await req.json();
        const parsed = CheckoutSchema.safeParse(body);
        
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const { items, customerEmail, shippingMethod } = parsed.data;

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

        // Determine shipping cost
        const shippingCost = shippingMethod === "express" ? 1499 : 599; // in cents
        const shippingLineItem = {
            price_data: {
                currency: 'eur',
                product_data: {
                    name: shippingMethod === "express" ? 'Express Delivery' : 'Standard Delivery',
                },
                unit_amount: shippingCost,
            },
            quantity: 1,
        };

        const allLineItems = [...lineItems, shippingLineItem];

        // The domain name depends on if we are in local dev or production Vercel
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail || undefined, // Pre-fill email from our checkout form if provided
            line_items: allLineItems,
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout`,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['IE', 'GB', 'US', 'AU'], // Allow common AF-Gear shipping locations
            }
        });

        // Save pending order to database
        const { createAdminClient } = await import('@/utils/supabase/admin');
        const supabase = createAdminClient();
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
