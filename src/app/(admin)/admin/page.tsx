import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import { ArrowUpRight, Package, AlertCircle, CheckCircle2, Clock, TrendingUp, Boxes, Tag, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = createAdminClient()

    if (!supabase) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg space-y-4 shadow-sm border border-red-100 max-w-2xl mx-auto my-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-80" />
                <h2 className="text-xl font-bold text-red-700">Database Connection Missing</h2>
                <p className="text-red-600">Please check your environment variables. You need to configure:</p>
                <div className="text-sm space-y-2 font-mono text-left max-w-sm mx-auto bg-white p-4 rounded-md border border-red-200">
                    <div className="text-gray-800">NEXT_PUBLIC_SUPABASE_URL</div>
                    <div className="text-gray-800">SUPABASE_SERVICE_ROLE_KEY</div>
                </div>
                <p className="text-sm text-red-500 mt-4">These need to be set in your <code className="bg-red-100 px-1 py-0.5 rounded">.env.local</code> file.</p>
            </div>
        )
    }

    // Fetch stats in parallel
    const [
        { count: totalProducts },
        { count: availableProducts },
        { count: totalOrders },
        { count: totalReviews },
        { data: recentProducts },
        { data: categories },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('product_status', 'available'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('id, name, price, product_status, visibility, images, category, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('category'),
    ])

    const uniqueCategories = new Set(categories?.map((c: { category: string }) => c.category).filter(Boolean))

    const stats = [
        { name: 'Total Products', stat: totalProducts || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Orders', stat: totalOrders || 0, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Reviews', stat: totalReviews || 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'Available', stat: availableProducts || 0, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Categories', stat: uniqueCategories.size, icon: Tag, color: 'text-violet-600', bg: 'bg-violet-50' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Overview of your store&apos;s inventory and recent activity.
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                    + Add Product
                </Link>
            </div>

            {/* Stats Grid */}
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative overflow-hidden rounded-xl bg-white px-4 py-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <dt className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${item.bg}`}>
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 truncate">{item.name}</span>
                        </dt>
                        <dd className="mt-3 ml-0">
                            <p className="text-3xl font-bold text-gray-900 tracking-tight">{item.stat}</p>
                        </dd>
                    </div>
                ))}
            </dl>

            {/* Recent Products */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Recent Products</h3>
                        <p className="text-sm text-gray-500">Latest additions to your store.</p>
                    </div>
                    <Link href="/admin/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        View all →
                    </Link>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visibility</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentProducts?.map((product: { id: string; name: string; price: number; product_status: string; visibility: string; images: string[]; category: string }) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {product.images?.[0] ? (
                                                <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-medium text-sm text-gray-900">{product.name}</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{product.category || '—'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.product_status === 'available' ? 'bg-emerald-50 text-emerald-700' :
                                        product.product_status === 'booking_only' ? 'bg-amber-50 text-amber-700' :
                                            'bg-red-50 text-red-700'
                                        }`}>
                                        {String(product.product_status || '').replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.visibility === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {product.visibility}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                    {product.price ? `€${Number(product.price).toFixed(2)}` : '—'}
                                </td>
                            </tr>
                        ))}
                        {(!recentProducts || recentProducts.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    No products yet. <Link href="/admin/products/new" className="text-indigo-600 font-medium hover:underline">Add your first product.</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href="/admin/products/new" className="group relative flex items-center space-x-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:bg-gray-50 hover:border-indigo-300 hover:ring-1 hover:ring-indigo-300">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-base font-semibold text-gray-900">Add New Product</p>
                        <p className="truncate text-sm text-gray-500 mt-0.5">Create a new product listing</p>
                    </div>
                </Link>
                <Link href="/admin/content" className="group relative flex items-center space-x-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:bg-gray-50 hover:border-indigo-300 hover:ring-1 hover:ring-indigo-300">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-100 transition-colors">
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-base font-semibold text-gray-900">Update Content</p>
                        <p className="truncate text-sm text-gray-500 mt-0.5">Edit homepage hero and marketing sections</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
