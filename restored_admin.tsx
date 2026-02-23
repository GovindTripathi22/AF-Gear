import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, EyeOff, Package, Search } from 'lucide-react'
import { deleteProduct } from './actions'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const supabase = createAdminClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all products in your store. {products?.length || 0} total.
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors flex items-center gap-1.5"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Visibility
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products?.map((product: {
                                id: string; name: string; product_status: string; stock_status: string;
                                visibility: string; price: number | null;
                                images: string[]; category: string
                            }) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3 group">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                {product.images?.[0] ? (
                                                    <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</span>
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {product.category || 'GÇö'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.product_status === 'available' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' :
                                            product.product_status === 'booking_only' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
                                                'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                            }`}>
                                            {String(product.product_status || 'unknown').replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className="capitalize">{String(product.stock_status || 'in_stock').replace('_', ' ')}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {product.visibility === 'published' ? (
                                                <Eye className="h-3.5 w-3.5 text-emerald-500" />
                                            ) : (
                                                <EyeOff className="h-3.5 w-3.5 text-gray-400" />
                                            )}
                                            <span className="text-sm text-gray-500">{product.visibility}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium text-gray-900">
                                        {product.price ? `Gé¼${Number(product.price).toFixed(2)}` : 'GÇö'}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <form action={deleteProduct.bind(null, product.id)}>
                                                <button type="submit" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(!products || products.length === 0) && (
                        <div className="text-center py-16">
                            <Package className="mx-auto h-10 w-10 text-gray-300" />
                            <p className="mt-3 text-sm text-gray-500">No products found.</p>
                            <Link href="/admin/products/new" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline">
                                Add your first product GåÆ
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
