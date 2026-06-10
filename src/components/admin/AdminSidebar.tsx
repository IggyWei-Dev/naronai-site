'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Package, Users, Mail, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminSidebarProps {
  role: 'superadmin' | 'editor'
  userEmail: string
}

const NAV = [
  { href: '/admin/orders',    label: 'Orders',    icon: ShoppingBag },
  { href: '/admin/products',  label: 'Products',  icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
]

export function AdminSidebar({ role, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const links = role === 'superadmin'
    ? [...NAV, { href: '/admin/newsletter', label: 'Newsletter', icon: Mail }]
    : NAV

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-[#161616] border-r border-[#2a2a2a] h-screen sticky top-0">
      {/* Wordmark */}
      <div className="px-6 py-5 border-b border-[#2a2a2a]">
        <span className="text-[#f5f0e8] font-light tracking-[0.25em] text-sm uppercase">
          Naronai
        </span>
        <span className="block text-[#8a8070] text-[10px] tracking-[0.12em] uppercase mt-0.5">
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors',
                active
                  ? 'bg-[#1e1e1e] text-[#c9a96e] border-l-2 border-[#c9a96e] pl-[10px]'
                  : 'text-[#8a8070] hover:text-[#f5f0e8] hover:bg-[#1a1a1a]',
              ].join(' ')}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User info + sign out */}
      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <p className="text-[#f5f0e8] text-xs truncate">{userEmail}</p>
        <p className="text-[#8a8070] text-[10px] capitalize mt-0.5">{role}</p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 mt-3 text-[#8a8070] hover:text-[#f5f0e8] text-xs transition-colors"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
