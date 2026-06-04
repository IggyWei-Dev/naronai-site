import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountView } from '@/components/account/AccountView'
import type { WishlistEntry } from '@/components/account/WishlistSection'

export const metadata = { title: 'My Account — Naronai' }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  const [{ data: profile }, { data: orders }, { data: wishlistRaw }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('wishlist_items')
      .select('id, product_id, products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const wishlist: WishlistEntry[] = (wishlistRaw ?? []).flatMap((item: any) =>
    item.products ? [{ wishlist_item_id: item.id, product: item.products }] : []
  )

  return (
    <AccountView
      user={{ id: user.id, email: user.email ?? '' }}
      profile={profile ?? null}
      orders={orders ?? []}
      wishlist={wishlist}
    />
  )
}
