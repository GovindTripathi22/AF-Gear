import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = ['govindtriapthi3@gmail.com', 'afgearie@yahoo.com', 'swrj003@gmail.com'];
const ADMIN_USER_ID = 'user_3AGRdBPjyzUMwKKmZJt8gqnLXZU' // Still maintaining for direct user ID support if needed

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress;

    // Only authorized admins can access admin pages
    const isAdmin = user?.id === ADMIN_USER_ID || (email && ADMIN_EMAILS.includes(email));

    if (!isAdmin) {
        redirect('/')
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" richColors closeButton />
            <AdminSidebar userEmail={null} signoutAction={async () => { 'use server' }} />
            <main className="flex-1 overflow-y-auto focus:outline-none">
                <div className="py-6 px-4 sm:px-6 lg:py-8 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
