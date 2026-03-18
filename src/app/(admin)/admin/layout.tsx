<<<<<<< HEAD
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
=======
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/auth/login/actions'
>>>>>>> target/main
import { Toaster } from 'sonner'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

<<<<<<< HEAD
const ADMIN_USER_ID = 'user_3AGRdBPjyzUMwKKmZJt8gqnLXZU'

=======
>>>>>>> target/main
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
<<<<<<< HEAD
    const { userId } = await auth()

    // Only the specific admin user can access admin pages
    if (!userId || userId !== ADMIN_USER_ID) {
        redirect('/')
=======
    const supabase = await createClient()

    let user = null;
    if (supabase) {
        const { data } = await supabase.auth.getUser()
        user = data?.user || null;
>>>>>>> target/main
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" richColors closeButton />
<<<<<<< HEAD
            <AdminSidebar userEmail={null} signoutAction={async () => { 'use server' }} />
=======
            <AdminSidebar userEmail={user?.email || null} signoutAction={signout} />
>>>>>>> target/main
            <main className="flex-1 overflow-y-auto focus:outline-none">
                <div className="py-6 px-4 sm:px-6 lg:py-8 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
