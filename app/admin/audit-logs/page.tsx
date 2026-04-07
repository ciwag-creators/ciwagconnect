import { requireAdmin } from '@/lib/admin-auth'

export default async function AuditLogsPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <p className="text-gray-500">Coming soon…</p>
    </div>
  )
}