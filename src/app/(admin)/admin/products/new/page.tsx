import ProductForm from '@/components/admin/ProductForm'
import { createAdminClient } from '@/utils/supabase/admin'
import { fetchCategories } from '@/services/categoryService'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
    const supabase = createAdminClient()
    const categories = await fetchCategories(supabase)

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <ProductForm categories={categories} />
        </div>
    )
}
