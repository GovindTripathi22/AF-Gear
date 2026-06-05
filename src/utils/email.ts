import { Resend } from 'resend';

let resend: any = null;

function getResendClient() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

/**
 * Escape HTML special characters to prevent injection in email templates.
 */
function escapeHtml(str = ''): string {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function sendOrderConfirmationEmail(orderData: any) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Skipping email confirmation.');
        return;
    }

    const { customer_email, customer_name, total_amount, items, order_reference } = orderData;

    const safeName = escapeHtml(customer_name);
    const safeReference = escapeHtml(order_reference?.slice(-8));

    const itemsHtml = items.map((item: any) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
             <p style="margin: 0; font-weight: bold;">${escapeHtml(item.title)} x ${Number(item.quantity) || 0}</p>
             <p style="margin: 0; color: #666;">Amount: €${Number(item.amount).toFixed(2)}</p>
        </div>
    `).join('');

    try {
        const client = getResendClient();
        if (!client) {
            console.error('Resend client failed to initialize.');
            return;
        }

        await client.emails.send({
            from: `AF Gear <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: [customer_email],
            subject: `Order Confirmed - #${safeReference}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #66BB6A; text-align: center;">Order Confirmed!</h1>
                    <p>Hi ${safeName || 'Customer'},</p>
                    <p>Thank you for your purchase from AF Gear. Your order is being processed.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Order Summary</h3>
                        ${itemsHtml}
                        <div style="text-align: right; font-weight: bold; font-size: 1.2em; margin-top: 20px;">
                            Total: €${Number(total_amount).toFixed(2)}
                        </div>
                    </div>

                    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
                        Order tracking will be sent once your items are shipped.
                    </p>
                </div>
            `,
        });

        console.log('Confirmation email sent to:', customer_email);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
}
