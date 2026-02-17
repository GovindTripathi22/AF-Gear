import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowUpRight, Package, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats (parallelize for performance)
    const [
        { count: totalProducts },
        { count: availableProducts },
        { count: bookingOnlyProducts },
        { count: unavailableProducts },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'booking_only'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'unavailable'),
    ])

    const stats = [
        { name: 'Total Products', stat: totalProducts || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-100' },
        { name: 'Available', stat: availableProducts || 0, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
        { name: 'Booking Only', stat: bookingOnlyProducts || 0, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100' },
        { name: 'Unavailable', stat: unavailableProducts || 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
    ]

    return (
        <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">Overview</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6"
                    >
                        <dt>
                            <div className={`absolute rounded-md p-3 ${item.bg}`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                            <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Quick Actions</h3>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link href="/admin/products/new" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <Package className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">Add New Product</p>
                            <p className="truncate text-sm text-gray-500">Create a new product listing</p>
                        </div>
                    </Link>
                    <Link href="/admin/content" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <ArrowUpRight className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">Update Content</p>
                            <p className="truncate text-sm text-gray-500">Edit homepage and other sections</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
