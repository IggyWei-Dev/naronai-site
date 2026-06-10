import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Naronai Admin' }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  const { data: adminRecord } = await supabase
    .from('admins')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!adminRecord) redirect('/?error=unauthorized')

  return (
    <div className="flex h-screen bg-[#0f0f0f] overflow-hidden">
      <AdminSidebar role={adminRecord.role} userEmail={user.email!} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
