'use client'

import { useActionState, useState, useEffect, startTransition } from 'react'
import { upsertProduct, uploadProductImage } from '@/app/(admin)/admin/products/actions'
import { Loader2, X, ImagePlus } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

 
export default function ProductForm({ product }: { product?: any }) {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<string[]>(product?.images || [])

    const [name, setName] = useState(product?.name || '')
    const [slug, setSlug] = useState(product?.slug || '')

    const [state, formAction, isPending] = useActionState(upsertProduct, null);

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        } else if (state?.success) {
            toast.success('Product saved successfully!')
            router.push('/admin/products')
            router.refresh()
        }
    }, [state, router]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setName(val)
        if (!product) {
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

            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadProductImage(formData);

            if (result.error) throw new Error(result.error);
            if (!result.url) throw new Error("No URL returned from upload");

            setImages(prev => [...prev, result.url!])
            toast.success('Image uploaded!')
        } catch (error) {
            toast.error('Error uploading image: ' + (error as Error).message)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <input type="hidden" name="id" value={product?.id || ''} />
            <input type="hidden" name="image_urls" value={images.join(',')} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {product ? 'Edit Product' : 'New Product'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {product ? 'Update the details for this product.' : 'Create a new product listing.'}
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                    {isPending ? 'Saving...' : 'Save Product'}
                </button>
            </div>

            {state?.error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-700">{state.error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Information</h4>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input type="text" name="name" id="name" value={name} onChange={handleNameChange} required
                                placeholder="e.g. Club Elite Home Jersey"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-400 mr-1">/products/</span>
                                <input type="text" name="slug" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
                                    placeholder="auto-generated-from-name"
                                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" name="description" rows={4} defaultValue={product?.description || ''}
                                placeholder="Write a detailed description of the product..."
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Images</h4>
                        <div className="flex flex-wrap gap-4">
                            {images.map((url, idx) => (
                                <div key={idx} className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gray-200 group hover:border-indigo-400 transition-colors">
                                    <Image src={url} alt="Product" fill className="object-cover" />
                                    <button type="button" onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        <X className="w-3 h-3" />
                                    </button>
                                    {idx === 0 && (
                                        <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-1.5 py-0.5 rounded">Primary</span>
                                    )}
                                </div>
                            ))}
                            <div className="relative w-28 h-28">
                                <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 transition-colors ${uploading ? 'opacity-50' : 'hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                    ) : (
                                        <>
                                            <ImagePlus className="w-6 h-6 text-gray-400" />
                                            <span className="text-[10px] text-gray-400 mt-1 font-medium">Add Image</span>
                                        </>
                                    )}
                                </div>
                                <input 
                                    id="image-upload" 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                    disabled={uploading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Pricing</h4>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                            <input type="number" name="price" id="price" step="0.01" min="0"
                                defaultValue={product?.price || ''} placeholder="0.00"
                                className="block w-full max-w-xs rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Status & Visibility */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</h4>

                        <div>
                            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                            <select id="visibility" name="visibility" defaultValue={product?.visibility || 'draft'}
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="published">Published (visible on website)</option>
                                <option value="draft">Draft (hidden)</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="product_status" className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                            <select id="product_status" name="product_status" defaultValue={product?.product_status || 'available'}
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="available">🟢 Available for Purchase</option>
                                <option value="coming_soon">⏳ Coming Soon</option>
                                <option value="unavailable">🔴 Unavailable</option>
                                <option value="booking_only">🟠 Booking Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Organization</h4>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select id="category" name="category" defaultValue={product?.category || ''} required
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="" disabled>Select a category</option>
                                <option value="Club">Club</option>
                                <option value="Limerick">Limerick</option>
                                <option value="Tipperary">Tipperary</option>
                                <option value="Irish">Irish</option>
                                <option value="SchoolUniform">School Uniform</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <input type="text" name="tags" id="tags" defaultValue={product?.tags?.join(', ') || ''}
                                placeholder="tag1, tag2, tag3"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Inventory</h4>

                        <div>
                            <label htmlFor="stock_status" className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                            <select id="stock_status" name="stock_status" defaultValue={product?.stock_status || 'in_stock'}
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="limited">Limited</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
