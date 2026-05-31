import type { Product } from '@/types'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product: _ }: ProductDetailsProps) {
  return <div aria-label="Product details" />
}
