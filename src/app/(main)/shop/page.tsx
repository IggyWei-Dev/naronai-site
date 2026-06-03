import { Suspense }                        from 'react'
import { ShopHero }                        from '@/components/shop/ShopHero'
import { ShopGrid }                        from '@/components/shop/ShopGrid'
import { ShopControls }                    from '@/components/shop/ShopControls'
import { FilterSidebar, MobileFilterBar }  from '@/components/shop/FilterSidebar'
import { ShopSkeleton }                    from '@/components/shop/ShopSkeleton'

export const metadata = { title: 'Shop — Naronai' }

interface ShopPageProps {
  searchParams: {
    filter?: string
    color?: string
    length?: string
    tier?: string
    sort?: string
  }
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page)' }}>

      {/* ── Full-width hero (sits under the fixed nav) ─────────── */}
      <ShopHero />

      {/* ── Sidebar + grid layout ─────────────────────────────── */}
      <div className="flex" style={{ alignItems: 'flex-start' }}>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Suspense fallback={null}>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 pb-20 pt-8 lg:px-10">

          {/* Mobile filter chips */}
          <div className="lg:hidden">
            <Suspense fallback={null}>
              <MobileFilterBar />
            </Suspense>
          </div>

          {/* Column resizer + product grid */}
          <ShopControls>
            <Suspense fallback={<ShopSkeleton />}>
              <ShopGrid searchParams={searchParams} />
            </Suspense>
          </ShopControls>

        </main>
      </div>
    </div>
  )
}
