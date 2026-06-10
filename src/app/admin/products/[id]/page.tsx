import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProductById } from '@/lib/admin/queries'
import { ProductForm } from '@/components/admin/products/ProductForm'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins').select('role').eq('user_id', user.id).single()

  const product = await getProductById(params.id)
  if (!product) notFound()

  return (
    <div className="p-8">
      <Link
        href="/admin/products"
        className="flex items-center gap-1.5 text-[#8a8070] hover:text-[#f5f0e8] text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={14} /> Products
      </Link>
      <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide mb-8">{product.name}</h1>
      <ProductForm product={product} role={adminRecord?.role ?? 'editor'} />
    </div>
  )
}
