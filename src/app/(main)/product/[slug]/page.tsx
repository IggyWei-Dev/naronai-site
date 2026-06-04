import { notFound }            from 'next/navigation'
import { createClient }        from '@/lib/supabase/server'
import { ProductGallery }      from '@/components/shop/ProductGallery'
import { ProductDetails }      from '@/components/shop/ProductDetails'
import type { Metadata }       from 'next'
import type { Product }        from '@/types'

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) return null

  return {
    ...data,
    price:     data.price / 100,
    inStock:   data.in_stock,
    isNew:     data.is_new,
    hairType:  data.hair_type,
    capType:   data.cap_type,
    createdAt: data.created_at,
  } as Product
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title:       product.name,
    description: product.description,
    openGraph: { images: product.images[0] ? [product.images[0]] : [] },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  return (
    <>
      <style>{`
        .product-page-grid {
          max-width: 1440px;
          margin: 0 auto;
          padding: 140px 64px 96px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .product-page-grid {
            grid-template-columns: 1fr;
            padding: 120px 24px 80px;
            gap: 32px;
          }
        }
      `}</style>
      <div className="product-page-grid">
        <ProductGallery images={product.images} name={product.name} />
        <ProductDetails product={product} />
      </div>
    </>
  )
}
