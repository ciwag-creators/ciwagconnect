'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type DailyTransaction = {
  date: string;
  total: number;
};

interface Props {
  data: DailyTransaction[];
}

export default function DailyTransactions({ data }: Props) {
  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Daily Transactions
      </h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />

            <YAxis
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />

            <Tooltip
             formatter={(value: number) => [value, 'Transactions']}
              labelFormatter={(label) =>
                new Date(label).toDateString()
              }
            />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}