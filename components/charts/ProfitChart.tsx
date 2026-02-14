'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

type ProfitItem = {
  date: string
  total: number
}

export default function ProfitChart({
  data
}: {
  data: ProfitItem[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#16a34a"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
