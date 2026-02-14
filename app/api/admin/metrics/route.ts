import supabaseAdmin from '@/lib/supabase/admin'

export async function GET() {
  try {
    /* ---------------- TRANSACTIONS ---------------- */
    const { data: transactions, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('amount, status, service')

    if (txError) {
      throw txError
    }

    let total_transactions = transactions.length
    let successful_transactions = 0
    let failed_transactions = 0
    let total_revenue = 0
    let airtime_volume = 0
    let data_volume = 0
    let bill_volume = 0

    for (const tx of transactions) {
      if (tx.status === 'success') {
        successful_transactions++
        total_revenue += tx.amount

        if (tx.service === 'airtime') airtime_volume += tx.amount
        if (tx.service === 'data') data_volume += tx.amount
        if (tx.service === 'bill') bill_volume += tx.amount
      } else if (tx.status === 'failed') {
        failed_transactions++
      }
    }

    /* ---------------- WALLETS ---------------- */
    const { data: wallets, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('balance')

    if (walletError) {
      throw walletError
    }

    const total_wallet_balance = wallets.reduce(
      (sum, w) => sum + w.balance,
      0
    )

    return Response.json({
      success: true,
      metrics: {
        total_transactions,
        successful_transactions,
        failed_transactions,
        total_revenue,
        airtime_volume,
        data_volume,
        bill_volume,
        total_wallet_balance
      }
    })

  } catch (err) {
    console.error('❌ Admin metrics error:', err)
    return Response.json(
      { error: 'Failed to load admin metrics' },
      { status: 500 }
    )
  }
}