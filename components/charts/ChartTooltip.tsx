'use client'

type TooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
  labelPrefix?: string
  valuePrefix?: string
}

export default function ChartTooltip({
  active,
  payload,
  label,
  labelPrefix = '',
  valuePrefix = ''
}: TooltipProps) {
  if (!active || !payload || !payload.length) return null

  const date = new Date(label || '').toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md text-sm">
      <p className="text-gray-500">{date}</p>
      <p className="font-semibold text-gray-900">
        {labelPrefix}
        {valuePrefix}
        {Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  )
}