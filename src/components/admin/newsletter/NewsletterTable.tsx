'use client'

import { useState } from 'react'
import type { NewsletterSubscriberRow } from '@/lib/supabase/types'

export function NewsletterTable({ subscribers }: { subscribers: NewsletterSubscriberRow[] }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('active')

  const filtered = filter === 'all'
    ? subscribers
    : subscribers.filter((s) => s.status === filter)

  function exportCSV() {
    const header = 'email,first_name,subscribed_at'
    const rows   = subscribers
      .filter((s) => s.status === 'active')
      .map((s) => `${s.email},${s.first_name ?? ''},${s.created_at}`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `naronai-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(['all', 'active', 'unsubscribed'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={[
                'px-3 py-1 rounded text-xs capitalize transition-colors',
                filter === v
                  ? 'bg-[#c9a96e] text-[#0f0f0f]'
                  : 'bg-[#1a1a1a] text-[#8a8070] hover:text-[#f5f0e8] border border-[#2a2a2a]',
              ].join(' ')}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f0e8] text-xs rounded hover:border-[#c9a96e] transition-colors"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2a2a2a] text-[#8a8070] text-xs">
            <th className="text-left py-2 pr-4 font-normal">Email</th>
            <th className="text-left py-2 pr-4 font-normal">Name</th>
            <th className="text-left py-2 pr-4 font-normal">Source</th>
            <th className="text-left py-2 pr-4 font-normal">Status</th>
            <th className="text-left py-2 font-normal">Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="border-b border-[#1e1e1e]">
              <td className="py-2.5 pr-4 text-[#f5f0e8]">{s.email}</td>
              <td className="py-2.5 pr-4 text-[#8a8070]">{s.first_name ?? '—'}</td>
              <td className="py-2.5 pr-4 text-[#8a8070] capitalize">{s.source ?? '—'}</td>
              <td className="py-2.5 pr-4">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  s.status === 'active'
                    ? 'bg-[#14532d] text-[#4ade80]'
                    : 'bg-[#374151] text-[#9ca3af]'
                }`}>
                  {s.status}
                </span>
              </td>
              <td className="py-2.5 text-[#8a8070] text-xs">
                {new Date(s.created_at).toLocaleDateString('en-NG', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
