import ProductForm from '@/components/ProductForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <ProductForm product={product} />
    </div>
  )
}
