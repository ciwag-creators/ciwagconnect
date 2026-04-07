import { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { requireAdmin } from '@/lib/admin-auth'

export default async function AdminLayout({
  children
}: {
  children: ReactNode
}) {
  // 🔐 Protect all admin routes
  await requireAdmin()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}