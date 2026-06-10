import { currentUser } from '@clerk/nextjs/server';
import { checkIsAdmin } from './adminList';

/**
 * Checks if the current user is an authorized admin.
 * Admins are defined in environment variables:
 * - ADMIN_EMAILS: Comma-separated list of authorized email addresses.
 * - ADMIN_USER_IDS: Comma-separated list of authorized Clerk user IDs.
 */
export async function checkAdmin() {
    const user = await currentUser();
    if (!user) return false;

    // First check dynamic environment variables (server-only)
    const adminEmailsEnv = process.env.ADMIN_EMAILS;
    const adminUserIdsEnv = process.env.ADMIN_USER_IDS;

    if (adminEmailsEnv || adminUserIdsEnv) {
        // Check by Clerk publicMetadata role
        if ((user.publicMetadata as { role?: string })?.role === 'admin') {
            return true;
        }

        // Check by user ID
        if (adminUserIdsEnv) {
            const adminUserIds = adminUserIdsEnv.split(',').map(id => id.trim()).filter(Boolean);
            if (adminUserIds.includes(user.id)) {
                return true;
            }
        }

        // Check by email addresses
        if (adminEmailsEnv) {
            const adminEmails = adminEmailsEnv.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
            const emails: string[] = [];
            if (user.primaryEmailAddress?.emailAddress) {
                emails.push(user.primaryEmailAddress.emailAddress.toLowerCase());
            }
            if (user.emailAddresses) {
                user.emailAddresses.forEach(e => {
                    if (e.emailAddress) {
                        emails.push(e.emailAddress.toLowerCase());
                    }
                });
            }
            if (emails.some(email => adminEmails.includes(email))) {
                return true;
            }
        }

        return false;
    }

    // Otherwise use default static adminList logic
    return checkIsAdmin(user);
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

