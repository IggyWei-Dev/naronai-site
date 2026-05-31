interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images: _, name: __ }: ProductGalleryProps) {
  return <div aria-label="Product gallery" />
}
