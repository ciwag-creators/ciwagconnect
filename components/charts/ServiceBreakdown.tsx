'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#16a34a', '#2563eb', '#dc2626']

export default function ServiceBreakdown({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-3">Transactions by Service</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="service"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
