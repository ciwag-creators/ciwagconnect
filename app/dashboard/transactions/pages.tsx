import TransactionsTable from '@/components/charts/TransactionsTable'
import { requireUser } from '@/lib/auth/requireUser'

async function getUserTransactions() {
  const res = await fetch('/api/transactions', {
    cache: 'no-store'
  })

  const json = await res.json()
  return json.data
}

export default async function UserTransactions() {
  await requireUser()

  const transactions = await getUserTransactions()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        My Transactions
      </h1>

      <TransactionsTable data={transactions} />
    </div>
  )
}
