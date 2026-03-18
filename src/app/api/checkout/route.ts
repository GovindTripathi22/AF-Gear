import { NextResponse } from 'next/server';
import Stripe from 'stripe';
<<<<<<< HEAD
import { z } from 'zod';
import { createAdminClient } from '@/utils/supabase/admin';
import { isRateLimited } from '@/utils/rateLimiter';

// Validate only IDs & quantities from the client — prices come from DB
const CheckoutSchema = z.object({
    items: z.array(z.object({
        id: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1).max(99),
        size: z.string().max(10),
    })).min(1, 'Cart is empty'),
    customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    shippingMethod: z.enum(['standard', 'express']).default('standard'),
});

export async function POST(req: Request) {
    // --- Rate Limiting ---
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(clientIp, 10, 60_000)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    // --- Origin Check ---
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;
    const allowed = (process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_APP_URL || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    if (origin && !allowed.includes(origin)) {
        return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
    }

    // --- Stripe Init ---
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }
    const stripe = new Stripe(stripeSecret, {
        apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
    });

    try {
        const body = await req.json();
        const parsed = CheckoutSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { items, customerEmail, shippingMethod } = parsed.data;

        // --- Server-Side Price Lookup (NEVER trust client prices) ---
        const supabase = createAdminClient();
        const productIds = items.map(item => item.id);

        const { data: products, error: dbError } = await supabase
            .from('products')
            .select('id, name, price, images')
            .in('id', productIds);

        if (dbError || !products || products.length === 0) {
            console.error('Product lookup failed:', dbError);
            return NextResponse.json(
                { error: 'Product lookup failed' },
                { status: 500 }
            );
        }

        // Validate all requested products exist in the DB
        const priceMap = new Map(products.map((p: any) => [String(p.id), p]));
        for (const item of items) {
            if (!priceMap.has(item.id)) {
                return NextResponse.json(
                    { error: `Product not found: ${item.id}` },
                    { status: 400 }
                );
            }
        }

        // Build Stripe line items using AUTHORITATIVE server-side prices
        const lineItems = items.map((item) => {
            const product = priceMap.get(item.id)!;
            const priceNum = Number(product.price);

            if (isNaN(priceNum) || priceNum <= 0) {
                throw new Error(`Invalid price for product ${product.name}`);
            }

            // Convert decimal price to cents (Stripe uses integer cents)
            const unitAmountCents = Math.round(priceNum * 100);
            const firstImage = product.images?.[0] || '';
=======
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
        const { items, customerEmail, shippingMethod } = await req.json();

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
>>>>>>> target/main

            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
<<<<<<< HEAD
                        name: `${product.name} (${item.size})`,
                        images: firstImage ? [firstImage] : [],
                        metadata: { product_id: product.id },
                    },
                    unit_amount: unitAmountCents,
=======
                        name: `${item.title} (${item.size})`,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(priceNum * 100), // Stripe uses cents 
>>>>>>> target/main
                },
                quantity: item.quantity,
            };
        });

<<<<<<< HEAD
        // Shipping cost
        const shippingCost = shippingMethod === 'express' ? 1499 : 599; // cents
=======
        // Determine shipping cost
        const shippingCost = shippingMethod === "express" ? 1499 : 599; // in cents
>>>>>>> target/main
        const shippingLineItem = {
            price_data: {
                currency: 'eur',
                product_data: {
<<<<<<< HEAD
                    name: shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
=======
                    name: shippingMethod === "express" ? 'Express Delivery' : 'Standard Delivery',
>>>>>>> target/main
                },
                unit_amount: shippingCost,
            },
            quantity: 1,
        };

        const allLineItems = [...lineItems, shippingLineItem];

<<<<<<< HEAD
        // --- Create Stripe Checkout Session ---
        const requestOrigin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail || undefined,
            line_items: allLineItems,
            mode: 'payment',
            success_url: `${requestOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${requestOrigin}/checkout`,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['IE', 'GB', 'US', 'AU'],
            },
            metadata: { application: 'afgear' },
        });

        // --- Save pending order to database ---
        const itemTotalCents = lineItems.reduce(
            (acc, li) => acc + li.price_data.unit_amount * li.quantity,
            0
        );
        const amountTotal = session.amount_total
            ? session.amount_total / 100
            : (itemTotalCents + shippingCost) / 100;

        await supabase.from('orders').insert({
            stripe_session_id: session.id,
            user_email: 'pending_checkout',
            amount: amountTotal,
            items: items.map(i => ({
                id: i.id,
                name: priceMap.get(i.id)!.name,
                size: i.size,
                quantity: i.quantity,
                unit_price: Number(priceMap.get(i.id)!.price),
            })),
            status: 'pending',
        });

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error('Checkout Error:', error instanceof Error ? error.message : error);
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to create checkout session' },
            { status: 500 }
        );
=======
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
>>>>>>> target/main
    }
}
