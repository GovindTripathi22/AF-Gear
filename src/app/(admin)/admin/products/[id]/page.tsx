import ProductForm from '@/components/admin/ProductForm'
import { createAdminClient } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()

  if (!product) {
    notFound()
  }

  return (
    <div>
      <ProductForm product={product} />
    </div>
  )
}
