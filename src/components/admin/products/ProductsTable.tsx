'use client'

import { useTransition } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import { toggleProductStock } from '@/lib/admin/actions'
import { formatNaira } from '@/lib/utils'
import type { ProductRow } from '@/lib/supabase/types'
import toast from 'react-hot-toast'

const TIER_COLOURS: Record<string, string> = {
  Signature: 'bg-[#1e3a5f] text-[#60a5fa]',
  Couture:   'bg-[#1e1b4b] text-[#a5b4fc]',
  Bespoke:   'bg-[#451a03] text-[#fbbf24]',
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [filterTier,  setFilterTier]  = useState<string>('all')
  const [filterStock, setFilterStock] = useState<string>('all')
  const [stockOverrides, setStockOverrides] = useState<Record<string, boolean>>({})

  function getStock(p: ProductRow) {
    return p.id in stockOverrides ? stockOverrides[p.id] : p.in_stock
  }

  const filtered = products.filter((p) => {
    const tierOk  = filterTier  === 'all' || p.tier === filterTier
    const stockOk = filterStock === 'all' || (filterStock === 'in' ? getStock(p) : !getStock(p))
    return tierOk && stockOk
  })

  function handleToggleStock(id: string, current: boolean) {
    const next = !current
    setStockOverrides((prev) => ({ ...prev, [id]: next }))
    startTransition(async () => {
      try {
        await toggleProductStock(id, next)
        router.refresh()
      } catch {
        setStockOverrides((prev) => ({ ...prev, [id]: current }))
        toast.error('Failed to update stock')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-1.5 rounded"
          >
            <option value="all">All tiers</option>
            <option value="Signature">Signature</option>
            <option value="Couture">Couture</option>
            <option value="Bespoke">Bespoke</option>
          </select>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-1.5 rounded"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#c9a96e] text-[#0f0f0f] text-sm rounded hover:bg-[#b8975e] transition-colors"
        >
          <Plus size={14} /> Add product
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#8a8070] text-sm py-12 text-center">No products found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#8a8070] text-xs">
              <th className="text-left py-2 pr-4 font-normal">Product</th>
              <th className="text-left py-2 pr-4 font-normal">Tier</th>
              <th className="text-left py-2 pr-4 font-normal">Category</th>
              <th className="text-right py-2 pr-4 font-normal">Price</th>
              <th className="text-center py-2 pr-4 font-normal">Stock</th>
              <th className="text-center py-2 font-normal">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition-colors group"
              >
                <td
                  className="py-3 pr-4 cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  <div className="flex items-center gap-3">
                    {product.images[0] ? (
                      <div className="w-10 h-10 rounded overflow-hidden bg-[#2a2a2a] shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-[#2a2a2a] shrink-0" />
                    )}
                    <span className="text-[#f5f0e8] group-hover:text-[#c9a96e] transition-colors">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td
                  className="py-3 pr-4 cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  {product.tier && (
                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${TIER_COLOURS[product.tier] ?? ''}`}>
                      {product.tier}
                    </span>
                  )}
                </td>
                <td
                  className="py-3 pr-4 text-[#8a8070] cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  {product.category ?? '—'}
                </td>
                <td
                  className="py-3 pr-4 text-right text-[#f5f0e8] cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  {formatNaira(product.price / 100)}
                </td>
                <td
                  className="py-3 pr-4 text-center cursor-pointer"
                  onClick={() => router.push(`/admin/products/${product.id}`)}
                >
                  <span className={`text-sm font-medium ${product.stock_count === 0 ? 'text-[#8a8070]' : 'text-[#f5f0e8]'}`}>
                    {product.stock_count}
                  </span>
                </td>
                <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={getStock(product)}
                    onCheckedChange={() => handleToggleStock(product.id, getStock(product))}
                    className="data-[state=checked]:bg-[#c9a96e]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
