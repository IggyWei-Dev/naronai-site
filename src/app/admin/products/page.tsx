import { getProducts } from '@/lib/admin/queries'
import { ProductsTable } from '@/components/admin/products/ProductsTable'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Products</h1>
        <p className="text-[#8a8070] text-sm mt-1">{products.length} products</p>
      </div>
      <ProductsTable products={products} />
    </div>
  )
}
