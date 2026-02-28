import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/auth/login/actions'
import { Toaster } from 'sonner'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    let user = null;
    if (supabase) {
        const { data } = await supabase.auth.getUser()
        user = data?.user || null;
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" richColors closeButton />
            <AdminSidebar userEmail={user?.email || null} signoutAction={signout} />
            <main className="flex-1 overflow-y-auto focus:outline-none">
                <div className="py-6 px-4 sm:px-6 lg:py-8 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
