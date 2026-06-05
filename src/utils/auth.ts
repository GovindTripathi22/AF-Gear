import { currentUser } from '@clerk/nextjs/server';

/**
 * Checks if the current user is an authorized admin.
 * Admins are defined in environment variables:
 * - ADMIN_EMAILS: Comma-separated list of authorized email addresses.
 * - ADMIN_USER_IDS: Comma-separated list of authorized Clerk user IDs.
 */
export async function checkAdmin() {
    const user = await currentUser();
    if (!user) return false;

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    const adminUserIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);

    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const userId = user.id;

    const isEmailAdmin = userEmail ? adminEmails.includes(userEmail) : false;
    const isIdAdmin = adminUserIds.includes(userId);

    return isEmailAdmin || isIdAdmin;
}

/**
 * Helper to ensure a user is an admin or throw an error.
 * Useful for server actions.
 */
export async function ensureAdmin() {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required.');
    }
}
