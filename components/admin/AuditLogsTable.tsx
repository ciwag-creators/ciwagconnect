'use client'

type AuditLog = {
  id: string
  user_id: string
  action: string
  amount: number
  reference: string
  created_at: string
}

export default function AuditLogsTable({
  data
}: {
  data: AuditLog[]
}) {
  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No audit logs yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-sm text-gray-600">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Reference</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map(log => (
            <tr
              key={log.id}
              className="border-b text-sm hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-mono text-xs">
                {log.user_id}
              </td>
              <td className="px-4 py-3 capitalize">
                {log.action.replace('_', ' ')}
              </td>
              <td className="px-4 py-3 font-medium">
                ₦{log.amount.toLocaleString()}
              </td>
              <td className="px-4 py-3 font-mono text-xs">
                {log.reference}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(log.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}