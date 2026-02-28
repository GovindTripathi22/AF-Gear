import { Resend } from 'resend';

let resend: any = null;

function getResendClient() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

export async function sendOrderConfirmationEmail(orderData: any) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping email confirmation.");
        return;
    }

    const { customer_email, customer_name, total_amount, items, stripe_session_id } = orderData;

    const itemsHtml = items.map((item: any) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <p style="margin: 0; font-weight: bold;">${item.title} x ${item.quantity}</p>
            <p style="margin: 0; color: #666;">Amount: €${item.amount.toFixed(2)}</p>
        </div>
    `).join('');

    try {
        const client = getResendClient();
        if (!client) {
            console.error("Resend client failed to initialize.");
            return;
        }

        await client.emails.send({
            from: 'AF Gear <onboarding@resend.dev>', // Change to your verified domain in production
            to: [customer_email],
            subject: `Order Confirmed - #${stripe_session_id.slice(-8)}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #66BB6A; text-align: center;">Order Confirmed!</h1>
                    <p>Hi ${customer_name || 'Customer'},</p>
                    <p>Thank you for your purchase from AF Gear. Your order is being processed.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Order Summary</h3>
                        ${itemsHtml}
                        <div style="text-align: right; font-weight: bold; font-size: 1.2em; margin-top: 20px;">
                            Total: €${total_amount.toFixed(2)}
                        </div>
                    </div>

                    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
                        Order tracking will be sent once your items are shipped.
                    </p>
                </div>
            `,
        });

        console.log("Confirmation email sent to:", customer_email);
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
    }
}
