'use client'

import { useState } from 'react'
import { formatNaira } from '@/lib/utils'
import type { CustomerWithStats } from '@/lib/admin/queries'

export function CustomersTable({ customers }: { customers: CustomerWithStats[] }) {
  const [search, setSearch] = useState('')

  const filtered = customers.filter(({ profile }) => {
    const q = search.toLowerCase()
    return !q
      || profile.full_name?.toLowerCase().includes(q)
      || profile.first_name?.toLowerCase().includes(q)
      || profile.last_name?.toLowerCase().includes(q)
  })

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name…"
        className="w-72 mb-4 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm placeholder:text-[#8a8070]"
      />

      {filtered.length === 0 ? (
        <p className="text-[#8a8070] text-sm py-12 text-center">No customers found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#8a8070] text-xs">
              <th className="text-left py-2 pr-4 font-normal">Name</th>
              <th className="text-left py-2 pr-4 font-normal">Phone</th>
              <th className="text-center py-2 pr-4 font-normal">Orders</th>
              <th className="text-right py-2 pr-4 font-normal">Total spent</th>
              <th className="text-left py-2 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ profile, orderCount, totalSpent }) => (
              <tr
                key={profile.id}
                className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition-colors"
              >
                <td className="py-3 pr-4">
                  <p className="text-[#f5f0e8]">
                    {profile.full_name
                      ?? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
                      ?? '—'}
                  </p>
                </td>
                <td className="py-3 pr-4 text-[#8a8070]">{profile.phone ?? '—'}</td>
                <td className="py-3 pr-4 text-center text-[#8a8070]">{orderCount}</td>
                <td className="py-3 pr-4 text-right text-[#f5f0e8]">
                  {formatNaira(totalSpent / 100)}
                </td>
                <td className="py-3 text-[#8a8070] text-xs">
                  {new Date(profile.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
