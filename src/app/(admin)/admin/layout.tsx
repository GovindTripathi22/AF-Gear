import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

import { checkAdmin } from '@/utils/auth'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Only authorized admins can access admin pages
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
        redirect('/')
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" richColors closeButton />
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto focus:outline-none">
                <div className="py-6 px-4 sm:px-6 lg:py-8 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
