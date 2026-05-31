interface ShopGridProps {
  searchParams: { filter?: string; color?: string; length?: string; tier?: string; sort?: string }
}

export async function ShopGrid({ searchParams: _ }: ShopGridProps) {
  return <div aria-label="Product grid" />
}
