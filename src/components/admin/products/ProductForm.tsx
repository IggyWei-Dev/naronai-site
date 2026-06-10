'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ImageUploadZone } from './ImageUploadZone'
import { ColorVariantBuilder } from './ColorVariantBuilder'
import type { ColorVariant } from './ColorVariantBuilder'
import { createProduct, updateProduct, deleteProduct } from '@/lib/admin/actions'
import type { ProductFormData } from '@/lib/admin/actions'
import { toSlug, fromKobo } from '@/lib/admin/utils'
import type { ProductRow } from '@/lib/supabase/types'
import toast from 'react-hot-toast'

const ALL_LENGTHS = ['12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"']
const TIERS       = ['Signature', 'Couture', 'Bespoke'] as const

interface Props {
  product?: ProductRow
  role:     'superadmin' | 'editor'
}

export function ProductForm({ product, role }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [name,        setName]        = useState(product?.name        ?? '')
  const [slug,        setSlug]        = useState(product?.slug        ?? '')
  const [tier,        setTier]        = useState<typeof TIERS[number]>(product?.tier ?? 'Signature')
  const [category,    setCategory]    = useState(product?.category    ?? '')
  const [priceNaira,  setPriceNaira]  = useState(product ? fromKobo(product.price) : 0)
  const [description, setDescription] = useState(product?.description ?? '')
  const [hairType,    setHairType]    = useState(product?.hair_type   ?? '')
  const [density,     setDensity]     = useState(product?.density     ?? '')
  const [capType,     setCapType]     = useState(product?.cap_type    ?? '')
  const [origin,      setOrigin]      = useState(product?.origin      ?? '')
  const [lengths,     setLengths]     = useState<string[]>(product?.lengths ?? [])
  const [colors,      setColors]      = useState<ColorVariant[]>(
    Array.isArray(product?.colors) ? (product.colors as ColorVariant[]) : []
  )
  const [images,   setImages]   = useState<string[]>(product?.images  ?? [])
  const [inStock,  setInStock]  = useState(product?.in_stock ?? true)
  const [isNew,    setIsNew]    = useState(product?.is_new   ?? false)

  // Auto-generate slug from name only when creating
  useEffect(() => {
    if (!product) setSlug(toSlug(name))
  }, [name, product])

  function toggleLength(l: string) {
    setLengths((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug || !tier || priceNaira <= 0) {
      toast.error('Name, slug, tier and price are required')
      return
    }

    const data: ProductFormData = {
      name, slug, description, tier, category,
      priceNaira, hairType, density, capType, origin,
      lengths, colors, images, inStock, isNew,
    }

    startTransition(async () => {
      try {
        if (product) {
          await updateProduct(product.id, data)
          toast.success('Product saved')
        } else {
          await createProduct(data)
          toast.success('Product created')
          router.push('/admin/products')
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to save product')
      }
    })
  }

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteProduct(product!.id)
        toast.success('Product deleted')
        router.push('/admin/products')
      } catch {
        toast.error('Failed to delete product')
      }
    })
  }

  const fieldClass = 'w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-[#f5f0e8] text-sm placeholder:text-[#8a8070] focus:outline-none focus:border-[#c9a96e]'
  const labelClass = 'block text-[#8a8070] text-xs uppercase tracking-widest mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic info */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] space-y-4">
        <h2 className="text-[#f5f0e8] text-sm font-medium">Basic Info</h2>

        <div>
          <label className={labelClass}>Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} placeholder="The Adanna" />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={fieldClass} placeholder="the-adanna" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tier *</label>
            <select value={tier} onChange={(e) => setTier(e.target.value as typeof TIERS[number])} className={fieldClass}>
              {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass} placeholder="Lace Front" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Price (₦) *</label>
          <input
            type="number" min={0} step={1}
            value={priceNaira || ''}
            onChange={(e) => setPriceNaira(Number(e.target.value))}
            required
            className={fieldClass}
            placeholder="89000"
          />
          {priceNaira > 0 && (
            <p className="text-[#8a8070] text-xs mt-1">Stored as {priceNaira * 100} kobo</p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-4">Description</h2>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-[#0f0f0f] border-[#2a2a2a] text-[#f5f0e8] placeholder:text-[#8a8070] resize-none"
          placeholder="Brand-voice copy for this product…"
        />
        <p className="text-[#8a8070] text-xs mt-1 text-right">{description.length} chars</p>
      </section>

      {/* Attributes */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] space-y-4">
        <h2 className="text-[#f5f0e8] text-sm font-medium">Attributes</h2>
        <div className="grid grid-cols-2 gap-4">
          {([
            { label: 'Hair type', value: hairType, set: setHairType, ph: 'Virgin Malaysian' },
            { label: 'Density',   value: density,  set: setDensity,  ph: '150%' },
            { label: 'Cap type',  value: capType,  set: setCapType,  ph: '13×4 HD Lace' },
            { label: 'Origin',    value: origin,   set: setOrigin,   ph: 'Malaysian' },
          ] as const).map(({ label, value: val, set, ph }) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <input value={val} onChange={(e) => (set as (v: string) => void)(e.target.value)} className={fieldClass} placeholder={ph} />
            </div>
          ))}
        </div>
      </section>

      {/* Lengths */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-3">Available Lengths</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_LENGTHS.map((l) => (
            <button
              key={l} type="button"
              onClick={() => toggleLength(l)}
              className={[
                'px-3 py-1 rounded text-sm border transition-colors',
                lengths.includes(l)
                  ? 'bg-[#c9a96e] border-[#c9a96e] text-[#0f0f0f]'
                  : 'bg-transparent border-[#2a2a2a] text-[#8a8070] hover:border-[#3a3a3a]',
              ].join(' ')}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-3">Colours</h2>
        <ColorVariantBuilder value={colors} onChange={setColors} />
      </section>

      {/* Images */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-3">Images</h2>
        <ImageUploadZone value={images} onChange={setImages} />
      </section>

      {/* Flags */}
      <section className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <h2 className="text-[#f5f0e8] text-sm font-medium mb-4">Flags</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-[#f5f0e8] text-sm">In stock</span>
            <Switch checked={inStock} onCheckedChange={setInStock} className="data-[state=checked]:bg-[#c9a96e]" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-[#f5f0e8] text-sm">New arrival</span>
            <Switch checked={isNew} onCheckedChange={setIsNew} className="data-[state=checked]:bg-[#c9a96e]" />
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#c9a96e] text-[#0f0f0f] text-sm rounded hover:bg-[#b8975e] disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving…' : product ? 'Save product' : 'Create product'}
        </button>

        {product && role === 'superadmin' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button type="button" className="text-[#f87171] text-sm hover:underline">
                Delete product
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#f5f0e8]">Delete {product.name}?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#8a8070]">
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#2a2a2a] text-[#8a8070]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-[#f87171] text-white hover:bg-[#ef4444]"
                >
                  Delete permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </form>
  )
}
