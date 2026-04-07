'use client'

type Wallet = {
  id: string
  user_id: string
  balance: number
  created_at: string
}

export default function WalletsTable({
  data
}: {
  data: Wallet[]
}) {
  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No wallets found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-sm text-gray-600">
            <th className="px-4 py-3">User ID</th>
            <th className="px-4 py-3">Balance</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>

        <tbody>
          {data.map(wallet => (
            <tr
              key={wallet.id}
              className="border-b text-sm hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-mono text-xs">
                {wallet.user_id}
              </td>
              <td className="px-4 py-3 font-medium">
                ₦{wallet.balance.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(wallet.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}