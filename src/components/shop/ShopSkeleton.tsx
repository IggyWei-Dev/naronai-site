export function ShopSkeleton() {
  return (
    <div className="shop-product-grid">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '0.5px solid var(--color-border-medium)',
          }}
        >
          <div className="skeleton-shimmer" style={{ aspectRatio: '3/4' }} />
          <div style={{ padding: '14px 16px', background: 'var(--color-bg-card)' }}>
            <div
              className="skeleton-shimmer"
              style={{ height: '15px', borderRadius: '4px', marginBottom: '10px', width: '62%' }}
            />
            <div
              className="skeleton-shimmer"
              style={{ height: '11px', borderRadius: '4px', width: '38%' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
