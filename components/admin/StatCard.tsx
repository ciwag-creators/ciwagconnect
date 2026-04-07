'use client'

type StatCardProps = {
  title: string
  value: string | number
  icon?: React.ReactNode
}

export default function StatCard({
  title,
  value,
  icon
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border">
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {value}
        </p>
      </div>

      {icon && (
        <div className="text-3xl text-gray-300">
          {icon}
        </div>
      )}
    </div>
  )
}