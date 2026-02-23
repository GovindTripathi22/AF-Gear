import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, LayoutDashboard, FileText, LogOut, ShoppingCart } from 'lucide-react'
import { signout } from '@/app/auth/login/actions'
import { Toaster } from 'sonner'

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

    // Temporarily disabled for testing
    // if (!user) {
    //     redirect('/auth/login')
    // }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" richColors closeButton />
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
                <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-6">
                        <span className="text-2xl font-black tracking-tight text-indigo-600">AF-Gear</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600">Admin</span>
                    </div>

                    <nav className="mt-8 flex-1 px-4 space-y-1">
                        <Link
                            href="/admin"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <LayoutDashboard className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/products"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <Package className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Products
                        </Link>

                        <Link
                            href="/admin/orders"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <ShoppingCart className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Orders
                        </Link>

                        <Link
                            href="/admin/reviews"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <FileText className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Reviews
                        </Link>

                        <Link
                            href="/admin/queries"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <FileText className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Queries
                        </Link>

                        <Link
                            href="/admin/reservations"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <Package className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Reservations
                        </Link>

                        <Link
                            href="/admin/content"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <FileText className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Content
                        </Link>

                        <Link
                            href="/admin/saved-designs"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <Package className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            Saved Designs
                        </Link>
                    </nav>

                    {/* User profile / Logout */}
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4 mt-auto">
                        <div className="flex-shrink-0 w-full group block">
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                        {user?.email || 'Guest Admin'}
                                    </p>
                                </div>
                                <form action={signout}>
                                    <button
                                        type="submit"
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Sign out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto focus:outline-none">
                <div className="py-8 px-8 xl:px-12 max-w-7xl mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
