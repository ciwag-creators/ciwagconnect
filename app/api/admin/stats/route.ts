import supabaseAdmin from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

/* ---------------- HELPERS ---------------- */

function getDateRange(start: Date, end: Date) {
  const dates: string[] = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  return dates
}

function normalizeDailyData(
  raw: { date: string; total: number }[],
  start: Date,
  end: Date
) {
  const map: Record<string, number> = {}

  raw.forEach(item => {
    map[item.date] = Number(item.total)
  })

  return getDateRange(start, end).map(date => ({
    date,
    total: map[date] || 0
  }))
}

/* ---------------- GET ADMIN STATS ---------------- */

export async function GET() {
  try {
    // 🔐 Ensure admin
    await requireAdmin()

    // last 7 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 6)

    const start = startDate.toISOString()
    const end = endDate.toISOString()

    /* ---------------- REVENUE ---------------- */
    const { data: revenueRaw, error: revenueError } =
      await supabaseAdmin.rpc('daily_revenue', {
        start_date: start,
        end_date: end
      })

    if (revenueError) throw revenueError

    /* ---------------- TRANSACTIONS ---------------- */
    const { data: transactionRaw, error: transactionError } =
      await supabaseAdmin.rpc('daily_transactions', {
        start_date: start,
        end_date: end
      })

    if (transactionError) throw transactionError

    /* ---------------- PROFIT ---------------- */
    const { data: profitRaw, error: profitError } =
      await supabaseAdmin.rpc('daily_profit', {
        start_date: start,
        end_date: end
      })

    if (profitError) throw profitError

    /* ---------------- NORMALIZE ---------------- */
    const daily_revenue = normalizeDailyData(
      revenueRaw || [],
      startDate,
      endDate
    )

    const daily_transactions = normalizeDailyData(
      transactionRaw || [],
      startDate,
      endDate
    )

    const daily_profit = normalizeDailyData(
      profitRaw || [],
      startDate,
      endDate
    )

    return Response.json({
      daily_revenue,
      daily_transactions,
      daily_profit
    })
  } catch (error: any) {
    console.error('Admin stats error:', error)

    return Response.json(
      { error: 'Failed to load admin stats' },
      { status: 500 }
    )
  }
}
