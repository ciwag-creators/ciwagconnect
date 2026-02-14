import StatCard from '@/components/admin/StatCard'
import { requireUser } from '@/lib/auth/requireUser'

export default async function DashboardPage() {
  await requireUser()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        User Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard title="Wallet Balance" value="₦0" />
        <StatCard title="Transactions" value={0} />
      </div>
    </div>
  )
}