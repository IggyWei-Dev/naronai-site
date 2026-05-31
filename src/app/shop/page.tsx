import { Suspense }       from 'react'
import { ShopGrid }       from '@/components/shop/ShopGrid'
import { FilterSidebar }  from '@/components/shop/FilterSidebar'

export const metadata = { title: 'Shop' }

export default function ShopPage({
  searchParams,
}: {
  searchParams: { filter?: string; color?: string; length?: string; tier?: string; sort?: string }
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-bg-page)',
      }}
    >
      {/* Filter sidebar */}
      <FilterSidebar />

      {/* Product grid */}
      <div style={{ flex: 1, padding: '40px 40px 80px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
            }}
          >
            All Collections
          </h1>
        </div>
        <Suspense fallback={<ShopSkeleton />}>
          <ShopGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

function ShopSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '3/4',
            background: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  )
}
