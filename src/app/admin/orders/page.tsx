import { getOrders } from '@/lib/admin/queries'
import { OrdersTable } from '@/components/admin/orders/OrdersTable'

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Orders</h1>
        <p className="text-[#8a8070] text-sm mt-1">{orders.length} total orders</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
