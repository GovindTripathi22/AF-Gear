'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { upsertProduct } from '@/app/admin/products/actions'
import { Loader2, X, Upload } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useFormStatus } from 'react-dom'

// Reusable Submit Button
function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Product'}
        </button>
    )
}

export default function ProductForm({ product }: { product?: any }) {
    const supabase = createClient()
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<string[]>(product?.images || [])

    // Basic slug generator
    const [name, setName] = useState(product?.name || '')
    const [slug, setSlug] = useState(product?.slug || '')

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setName(val)
        if (!product) { // Only auto-generate slug for new products
            setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''))
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)

            setImages(prev => [...prev, data.publicUrl])
            toast.success('Image uploaded!')
        } catch (error: any) {
            toast.error('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const clientAction = async (formData: FormData) => {
        const result = await upsertProduct(null, formData)
        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <form action={clientAction} className="space-y-8 divide-y divide-gray-200">
            <input type="hidden" name="id" value={product?.id || ''} />
            <input type="hidden" name="image_urls" value={images.join(',')} />

            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div className="space-y-6 sm:space-y-5">
                    <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            {product ? 'Edit Product' : 'New Product'}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Fill in the details for your product.
                        </p>
                    </div>

                    <div className="space-y-6 sm:space-y-5">
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Product Name
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Slug
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="slug"
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Description
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    defaultValue={product?.description || ''}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xl sm:text-sm sm:leading-6 pl-2"
                                />
                                <p className="mt-2 text-sm text-gray-500">Write a few sentences about the product.</p>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Images
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {images.map((url, idx) => (
                                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                            <Image src={url} alt="Product" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label
                                    htmlFor="image-upload"
                                    className={`relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <span className="inline-flex items-center gap-2 border border-dashed border-gray-300 px-4 py-2 rounded-lg">
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                        Upload Image
                                    </span>
                                    <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Price
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    step="0.01"
                                    defaultValue={product?.price || ''}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                />
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Status
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={product?.status || 'available'}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="booking_only">Booking Only</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="visibility" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Visibility
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <select
                                    id="visibility"
                                    name="visibility"
                                    defaultValue={product?.visibility || 'draft'}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Stock Status
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <select
                                    id="stock"
                                    name="stock"
                                    defaultValue={product?.stock || 'in_stock'}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                >
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                    <option value="limited">Limited</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="tags" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                Tags
                            </label>
                            <div className="mt-2 sm:col-span-2 sm:mt-0">
                                <input
                                    type="text"
                                    name="tags"
                                    id="tags"
                                    defaultValue={product?.tags?.join(', ') || ''}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="pt-5 flex justify-end">
                <SubmitButton />
            </div>
        </form>
    )
}
