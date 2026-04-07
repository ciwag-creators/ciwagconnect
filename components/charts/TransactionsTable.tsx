'use client'

type Transaction = {
  id: string
  amount: number
  created_at: string
}

interface Props {
  data: Transaction[]
}

export default function TransactionsTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No transactions available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="p-2">{transaction.id}</td>
              <td className="p-2">
                ₦{transaction.amount.toLocaleString()}
              </td>
              <td className="p-2">
                {new Date(transaction.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
