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

    const isAdmin = (user.publicMetadata as { role?: string })?.role === 'admin';
    return isAdmin;
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
