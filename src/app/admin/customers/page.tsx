import { getCustomersWithStats } from '@/lib/admin/queries'
import { CustomersTable } from '@/components/admin/customers/CustomersTable'

export default async function CustomersPage() {
  const customers = await getCustomersWithStats()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[#f5f0e8] text-xl font-light tracking-wide">Customers</h1>
        <p className="text-[#8a8070] text-sm mt-1">{customers.length} registered customers</p>
      </div>
      <CustomersTable customers={customers} />
    </div>
  )
}
