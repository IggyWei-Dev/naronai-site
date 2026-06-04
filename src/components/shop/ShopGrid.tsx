import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'
import type { Product, ProductColor } from '@/types'
import type { ProductRow } from '@/lib/supabase/types'

function toProduct(row: ProductRow): Product {
  return {
    id:          row.id,
    slug:        row.slug,
    name:        row.name,
    description: row.description ?? '',
    price:       row.price / 100,
    images:      row.images,
    tier:        row.tier ?? undefined,
    inStock:     row.in_stock,
    isNew:       row.is_new,
    hairType:    row.hair_type ?? undefined,
    length:      row.length ?? undefined,
    density:     row.density ?? undefined,
    capType:     row.cap_type ?? undefined,
    origin:      row.origin ?? undefined,
    category:    row.category ?? undefined,
    colors:      Array.isArray(row.colors) ? (row.colors as unknown as ProductColor[]) : [],
    lengths:     row.lengths,
    createdAt:   row.created_at,
  }
}

interface ShopGridProps {
  searchParams: {
    filter?: string
    color?: string
    length?: string
    tier?: string
    sort?: string
  }
}

export async function ShopGrid({ searchParams }: ShopGridProps) {
  const { filter, color, length, tier, sort = 'newest' } = searchParams
  const supabase = createClient()

  let query = supabase.from('products').select('*')

  if (tier) {
    query = query.eq('tier', tier) as typeof query
  }
  if (filter === 'in-stock') {
    query = query.eq('in_stock', true) as typeof query
  }
  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true }) as typeof query
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false }) as typeof query
  } else {
    query = query.order('created_at', { ascending: false }) as typeof query
  }

  const { data, error } = await query

  if (error || !data) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 0',
        gap: '12px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          letterSpacing: '0.06em',
          color: 'var(--color-text-muted)',
        }}>
          Something went wrong. Please try again.
        </p>
      </div>
    )
  }

  let products = data.map(toProduct)

  if (color) {
    const selected = color.split(',').filter(Boolean)
    products = products.filter(p =>
      p.colors?.some(c => selected.includes(c.name))
    )
  }

  if (length) {
    const selected = length.split(',').filter(Boolean)
    products = products.filter(p =>
      p.lengths?.some(l => selected.includes(l))
    )
  }

  if (products.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 0',
        gap: '12px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
        }}>
          No pieces found
        </p>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '12px',
          letterSpacing: '0.06em',
          color: 'var(--color-text-muted)',
        }}>
          Try adjusting your filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <div
      aria-label="Product grid"
      className="shop-product-grid"
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  )
}
