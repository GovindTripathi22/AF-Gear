import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/utils/supabase/admin';
import { isRateLimited } from '@/utils/rateLimiter';
import { auth } from '@clerk/nextjs/server';
import { sendOrderConfirmationEmail } from '@/utils/email';

// Validate only IDs & quantities from the client — prices come from DB
const CheckoutSchema = z.object({
    items: z.array(z.object({
        id: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1).max(99),
        size: z.string().max(10),
    })).min(1, 'Cart is empty'),
    customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    shippingMethod: z.enum(['standard', 'express']).default('standard'),
    shippingAddress: z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(2, 'Country is required'),
    }).optional(),
});

export async function POST(req: Request) {
    const { userId } = await auth();
    const contentType = req.headers.get('content-type') || '';
    const isFormSubmit = contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data');

    // --- Rate Limiting ---
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(clientIp, 10, 60_000)) {
        const errorMsg = 'Too many requests. Please try again later.';
        if (isFormSubmit) {
            return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
        }
        return NextResponse.json(
            { error: errorMsg },
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
        const errorMsg = 'Origin not allowed';
        if (isFormSubmit) {
            return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
        }
        return NextResponse.json({ error: errorMsg }, { status: 403 });
    }

    try {
        let body: any;
        if (isFormSubmit) {
            const formData = await req.formData();
            
            let parsedItems = [];
            try {
                const itemsStr = formData.get('items') as string;
                parsedItems = itemsStr ? JSON.parse(itemsStr) : [];
            } catch (e) {
                console.error("Failed to parse items from form input:", e);
            }

            parsedItems = parsedItems.map((item: any) => ({
                ...item,
                quantity: typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
            }));

            body = {
                items: parsedItems,
                customerEmail: formData.get('email') || '',
                shippingMethod: formData.get('shippingMethod') || 'standard',
                shippingAddress: {
                    firstName: formData.get('firstName') || '',
                    lastName: formData.get('lastName') || '',
                    address: formData.get('address') || '',
                    city: formData.get('city') || '',
                    postalCode: formData.get('postalCode') || '',
                    country: formData.get('country') || '',
                }
            };
        } else {
            body = await req.json();
        }

        const parsed = CheckoutSchema.safeParse(body);

        if (!parsed.success) {
            const errorMsg = parsed.error.issues[0].message;
            if (isFormSubmit) {
                return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
            }
            return NextResponse.json(
                { error: errorMsg },
                { status: 400 }
            );
        }

        const { items, customerEmail, shippingMethod, shippingAddress } = parsed.data;

        // --- Server-Side Price Lookup (NEVER trust client prices) ---
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const useMockDb = !supabaseUrl || !serviceRoleKey;
        const productIds = items.map(item => item.id);

        let products: any[] = [];
        if (useMockDb) {
            console.warn("Supabase credentials missing. Running checkout in MOCK mode.");
            // Filter MOCK_PRODUCTS by the requested product IDs or slugs
            const mockSource = (await import('@/services/productService')).MOCK_PRODUCTS;
            products = mockSource.filter(p => productIds.includes(String(p.id)) || productIds.includes(p.slug));
        } else {
            const supabase = createAdminClient();
            const { data, error: dbError } = await supabase
                .from('products')
                .select('id, name, price, price_cents, images')
                .in('id', productIds);

            if (dbError) {
                console.error('Product lookup failed:', dbError);
                const errorMsg = 'Product lookup failed';
                if (isFormSubmit) {
                    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
                }
                return NextResponse.json(
                    { error: errorMsg },
                    { status: 500 }
                );
            }
            products = data || [];
        }

        if (!products || products.length === 0) {
            const errorMsg = 'Product lookup failed: No matching products found';
            if (isFormSubmit) {
                return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
            }
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        // Validate all requested products exist in the database
        const priceMap = new Map(products.map((p: any) => [String(p.id), p]));
        for (const item of items) {
            if (!priceMap.has(item.id)) {
                const errorMsg = `Product not found: ${item.id}`;
                if (isFormSubmit) {
                    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
                }
                return NextResponse.json(
                    { error: errorMsg },
                    { status: 400 }
                );
            }
        }

        // Build line items using AUTHORITATIVE server-side prices
        const validatedItems = items.map((item) => {
            const product = priceMap.get(item.id)!;
            
            // Prefer DB-defined integer price_cents to avoid floating point issues
            let unitAmountCents = product.price_cents;
            if (unitAmountCents === undefined || unitAmountCents === null) {
                const priceNum = Number(product.price);
                if (isNaN(priceNum) || priceNum <= 0) {
                    throw new Error(`Invalid price for product ${product.name}`);
                }
                unitAmountCents = Math.round(priceNum * 100);
            }

            if (unitAmountCents <= 0) {
                throw new Error(`Invalid price for product ${product.name}`);
            }

            return {
                id: item.id,
                name: product.name,
                size: item.size,
                quantity: item.quantity,
                unitPriceCents: unitAmountCents,
            };
        });

        // Shipping cost
        const shippingCost = shippingMethod === 'express' ? 1499 : 599; // cents

        // Calculate totals
        const itemTotalCents = validatedItems.reduce(
            (acc, item) => acc + item.unitPriceCents * item.quantity,
            0
        );
        const amountTotal = (itemTotalCents + shippingCost) / 100;

        // Generate unique order reference (replacing Stripe Session ID)
        const orderRef = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // --- Save pending order to database ---
        let insertError = null;
        if (!useMockDb) {
            const supabase = createAdminClient();
            const { error } = await supabase.from('orders').insert({
                order_reference: orderRef,
                user_id: userId || null,
                user_email: customerEmail || 'pending_checkout',
                amount: amountTotal,
                items: validatedItems.map(i => ({
                    id: i.id,
                    name: i.name,
                    size: i.size,
                    quantity: i.quantity,
                    unit_price: i.unitPriceCents / 100,
                })),
                status: 'pending',
                ...(shippingAddress ? {
                    customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    shipping_address: {
                        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                        line1: shippingAddress.address,
                        city: shippingAddress.city,
                        postal_code: shippingAddress.postalCode,
                        country: shippingAddress.country
                    }
                } : {})
            });
            insertError = error;
        } else {
            console.log("Mock mode: skipping database insertion for order ref:", orderRef);
        }

        if (insertError) {
            console.error('Failed to log order to database:', insertError);
            const errorMsg = 'An error occurred while creating your order in the database.';
            if (isFormSubmit) {
                return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
            }
            return NextResponse.json(
                { error: errorMsg },
                { status: 500 }
            );
        }

        // --- Send Email Confirmation via Resend ---
        try {
            const emailItems = validatedItems.map(i => ({
                title: i.name,
                quantity: i.quantity,
                amount: (i.unitPriceCents / 100) * i.quantity
            }));
            await sendOrderConfirmationEmail({
                customer_email: customerEmail || 'pending_checkout@af-gear.com',
                customer_name: shippingAddress ? `${shippingAddress.firstName} ${shippingAddress.lastName}` : "Customer",
                total_amount: amountTotal,
                items: emailItems,
                order_reference: orderRef
            });
        } catch (emailErr) {
            console.error("Failed to send order email:", emailErr);
        }

        const rawNumber = process.env.WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '353863125706';
        let whatsappNumber = rawNumber.replace(/[^0-9]/g, '');
        
        // Normalize: if it starts with '0' and has a length of 10 (typical local Irish mobile number like 086...),
        // strip the leading '0' and prepend the '353' country code.
        if (whatsappNumber.startsWith('0') && whatsappNumber.length === 10) {
            whatsappNumber = '353' + whatsappNumber.slice(1);
        }

        let message = `🛒 *New Order from AF Gear* 🛒\n`;
        message += `--------------------------------------\n`;
        message += `*Order Reference:* ${orderRef}\n`;
        if (shippingAddress) {
            message += `*Customer:* ${shippingAddress.firstName} ${shippingAddress.lastName}\n`;
        }
        message += `*Email:* ${customerEmail || 'N/A'}\n\n`;

        if (shippingAddress) {
            message += `*Shipping Address:*\n`;
            message += `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}\n`;
            message += `*Shipping Method:* ${shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery'} (€${(shippingCost / 100).toFixed(2)})\n\n`;
        }

        message += `📦 *Items Ordered:*\n`;
        validatedItems.forEach(item => {
            const lineTotal = (item.unitPriceCents / 100) * item.quantity;
            message += `• ${item.name} (Size: ${item.size}) x ${item.quantity} - €${lineTotal.toFixed(2)}\n`;
        });
        message += `\n`;
        message += `*Subtotal:* €${(itemTotalCents / 100).toFixed(2)}\n`;
        message += `*Shipping:* €${(shippingCost / 100).toFixed(2)}\n`;
        message += `--------------------------------------\n`;
        message += `💰 *Total Amount:* €${amountTotal.toFixed(2)}\n`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        if (isFormSubmit) {
            return NextResponse.redirect(whatsappUrl, 303);
        }
        return NextResponse.json({ url: whatsappUrl, orderRef });
    } catch (error: unknown) {
        console.error('Checkout Error:', error instanceof Error ? error.stack || error.message : error);
        const errorMsg = 'An unexpected error occurred while processing your checkout. Please try again.';
        if (isFormSubmit) {
            return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
        }
        return NextResponse.json(
            { error: errorMsg },
            { status: 500 }
        );
    }
}
