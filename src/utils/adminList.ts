export const ADMIN_EMAILS = [
    'govindtriapthi3@gmail.com',
    'afgearie@yahoo.com',
    'swrj003@gmail.com'
];

export const ADMIN_USER_IDS = [
    'user_3AGRdBPjyzUMwKKmZJt8gqnLXZU'
];

export function checkIsAdmin(user: { 
    id: string; 
    emailAddresses?: Array<{ emailAddress: string }>;
    primaryEmailAddress?: { emailAddress: string } | null;
    publicMetadata?: { role?: string };
} | null | undefined): boolean {
    if (!user) return false;

    // 1. Check by Clerk publicMetadata role
    if (user.publicMetadata?.role === 'admin') {
        return true;
    }

    // 2. Check by Clerk User ID
    if (ADMIN_USER_IDS.includes(user.id)) {
        return true;
    }

    // 3. Check by Email Address
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

    const lowerAdminEmails = ADMIN_EMAILS.map(e => e.toLowerCase());
    if (emails.some(email => lowerAdminEmails.includes(email))) {
        return true;
    }

    return false;
}
