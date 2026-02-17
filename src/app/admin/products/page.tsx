import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteProduct } from './actions'

interface Product {
    id: string
    name: string
    status: string
    stock: string
    visibility: string
    price: number | null
}

export default async function ProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the products in your store including their name, price, status, and visibility.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/admin/products/new"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <div className="flex items-center gap-x-1">
                            <Plus className="h-4 w-4" />
                            Add product
                        </div>
                    </Link>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Stock
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Visibility
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Price
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {products?.map((product: Product) => (
                                        <tr key={product.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {product.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${product.status === 'available' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                                                    product.status === 'booking_only' ? 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20' :
                                                        'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                                    }`}>
                                                    {product.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {product.stock.replace('_', ' ')}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-x-2">
                                                    {product.visibility === 'published' ? (
                                                        <Eye className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    )}
                                                    {product.visibility}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {product.price ? `$${product.price}` : '-'}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-x-2">
                                                    <Link href={`/admin/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit, {product.name}</span>
                                                    </Link>
                                                    <form action={async () => {
                                                        'use server'
                                                        await deleteProduct(product.id)
                                                    }}>
                                                        <button type="submit" className="text-red-600 hover:text-red-900">
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete, {product.name}</span>
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!products || products.length === 0) && (
                                <div className="text-center py-10">
                                    <p className="text-gray-500">No products found. Add one to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
