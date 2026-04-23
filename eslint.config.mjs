"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// expected data shape: [{ date: '2026-01-01', total: 45 }]

export default function DailyTransactions({ data = [] }) {
  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">
        Daily Transactions
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}