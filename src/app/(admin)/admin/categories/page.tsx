import { getCategories } from './actions'
import CategoryManager from '@/components/admin/CategoryManager'
import { Tags } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-600 uppercase mb-2 block">
                        Store Configuration
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-900 uppercase tracking-tight leading-none flex items-center gap-3">
                        <Tags className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                        Categories
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 tracking-wide">
                        Manage store categories. Changes reflect live on the website.{' '}
                        <span className="font-medium text-gray-700">{categories.length} categories</span>
                    </p>
                </div>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    )
}
