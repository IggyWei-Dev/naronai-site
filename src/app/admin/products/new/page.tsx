import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/products/ProductForm'

export default async function NewProductPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins').select('role').eq('user_id', user.id).single()

  return (
    <div className="p-8">
      <Link
        href="/admin/products"
        className="flex items-center gap-1.5 text-[#8a8070] hover:text-[#f5f0e8] text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={14} /> Products
      </Link>
      <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide mb-8">New Product</h1>
      <ProductForm role={adminRecord?.role ?? 'editor'} />
    </div>
  )
}
