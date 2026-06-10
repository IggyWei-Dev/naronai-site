import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getNewsletterSubscribers } from '@/lib/admin/queries'
import { NewsletterTable } from '@/components/admin/newsletter/NewsletterTable'

export default async function NewsletterPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins').select('role').eq('user_id', user.id).single()

  if (adminRecord?.role !== 'superadmin') redirect('/admin/orders')

  const subscribers  = await getNewsletterSubscribers()
  const activeCount  = subscribers.filter((s) => s.status === 'active').length

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Newsletter</h1>
        <p className="text-[#8a8070] text-sm mt-1">{activeCount} active subscribers</p>
      </div>
      <NewsletterTable subscribers={subscribers} />
    </div>
  )
}
