import { PRODUCTS } from '@/lib/data/products'
import { ProductCard } from '@/components/shop/ProductCard'

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

  let products = [...PRODUCTS]

  if (tier) {
    products = products.filter(p => p.tier === tier)
  }

  if (filter === 'in-stock') {
    products = products.filter(p => p.inStock)
  }

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

  if (sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price)
  } else {
    products.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
