import StatCard from '@/components/admin/StatCard'
import RevenueChart from '@/components/charts/RevenueChart'
import DailyTransactions from '@/components/charts/DailyTransactions'
import TransactionsTable from '@/components/charts/TransactionsTable'
import { requireAdmin } from '@/lib/admin-auth'

/* ================= TYPES ================= */

type RevenueItem = {
  date: string
  revenue: number
}

type Transaction = {
  id: string
  amount: number
  created_at: string
}

type DailyTransaction = {
  date: string
  total: number
}

/* ================= FETCH FUNCTIONS ================= */

async function getAdminStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/stats`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch admin stats')
  }

  return res.json()
}

async function getRecentTransactions(): Promise<Transaction[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/transactions`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch transactions')
  }

  const json = await res.json()
  return json.data as Transaction[]
}

/* ================= PAGE ================= */

export default async function AdminDashboard() {
  await requireAdmin()

  const stats = await getAdminStats()
  const transactions = await getRecentTransactions()

  /* ---------- Revenue Chart Data ---------- */
  const revenueData: RevenueItem[] = stats.daily_revenue.map(
    (item: any) => ({
      date: item.date,
      revenue: item.total,
    })
  )

  /* ---------- Daily Transactions Data ---------- */
  const dailyData: DailyTransaction[] = transactions.reduce(
    (acc: DailyTransaction[], transaction) => {
      const date = new Date(transaction.created_at)
        .toISOString()
        .split('T')[0]

      const existing = acc.find(item => item.date === date)

      if (existing) {
        existing.total += transaction.amount
      } else {
        acc.push({
          date,
          total: transaction.amount,
        })
      }

      return acc
    },
    []
  )

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          value={stats.total_transactions}
        />

        <StatCard
          title="Total Revenue"
          value={`₦${Number(stats.total_revenue).toLocaleString()}`}
        />

        <StatCard
          title="Successful"
          value={stats.successful_transactions}
        />

        <StatCard
          title="Pending"
          value={stats.pending_transactions}
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Daily Revenue
          </h2>
          <RevenueChart data={revenueData} />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Daily Transactions
          </h2>
          <DailyTransactions data={dailyData} />
        </div>
      </div>

      {/* ================= RECENT TRANSACTIONS TABLE ================= */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Recent Transactions
        </h2>
        <TransactionsTable data={transactions} />
      </div>
    </div>
  )
}
