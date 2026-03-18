import { Resend } from 'resend';

let resend: any = null;

function getResendClient() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

<<<<<<< HEAD
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
=======
export async function sendOrderConfirmationEmail(orderData: any) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping email confirmation.");
>>>>>>> target/main
        return;
    }

    const { customer_email, customer_name, total_amount, items, stripe_session_id } = orderData;

<<<<<<< HEAD
    const safeName = escapeHtml(customer_name);
    const safeSessionId = escapeHtml(stripe_session_id?.slice(-8));

    const itemsHtml = items.map((item: any) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <p style="margin: 0; font-weight: bold;">${escapeHtml(item.title)} x ${Number(item.quantity) || 0}</p>
            <p style="margin: 0; color: #666;">Amount: €${Number(item.amount).toFixed(2)}</p>
=======
    const itemsHtml = items.map((item: any) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <p style="margin: 0; font-weight: bold;">${item.title} x ${item.quantity}</p>
            <p style="margin: 0; color: #666;">Amount: €${item.amount.toFixed(2)}</p>
>>>>>>> target/main
        </div>
    `).join('');

    try {
        const client = getResendClient();
        if (!client) {
<<<<<<< HEAD
            console.error('Resend client failed to initialize.');
=======
            console.error("Resend client failed to initialize.");
>>>>>>> target/main
            return;
        }

        await client.emails.send({
            from: 'AF Gear <onboarding@resend.dev>', // Change to your verified domain in production
            to: [customer_email],
<<<<<<< HEAD
            subject: `Order Confirmed - #${safeSessionId}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #66BB6A; text-align: center;">Order Confirmed!</h1>
                    <p>Hi ${safeName || 'Customer'},</p>
=======
            subject: `Order Confirmed - #${stripe_session_id.slice(-8)}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #66BB6A; text-align: center;">Order Confirmed!</h1>
                    <p>Hi ${customer_name || 'Customer'},</p>
>>>>>>> target/main
                    <p>Thank you for your purchase from AF Gear. Your order is being processed.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Order Summary</h3>
                        ${itemsHtml}
                        <div style="text-align: right; font-weight: bold; font-size: 1.2em; margin-top: 20px;">
<<<<<<< HEAD
                            Total: €${Number(total_amount).toFixed(2)}
=======
                            Total: €${total_amount.toFixed(2)}
>>>>>>> target/main
                        </div>
                    </div>

                    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
                        Order tracking will be sent once your items are shipped.
                    </p>
                </div>
            `,
        });

<<<<<<< HEAD
        console.log('Confirmation email sent to:', customer_email);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
=======
        console.log("Confirmation email sent to:", customer_email);
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
>>>>>>> target/main
    }
}
