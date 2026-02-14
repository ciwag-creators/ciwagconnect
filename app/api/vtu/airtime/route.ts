import supabaseAdmin from '@/lib/supabase/admin'
import { logWalletAction } from '@/lib/vtu/audit'
import vtuProvider from '@/lib/vtu'

interface AirtimeRequestBody {
  user_id: string
  network: string
  phone: string
  amount: number
  reference: string
}

export async function POST(req: Request) {
  try {
    const body: AirtimeRequestBody = await req.json()
    const { user_id, network, phone, amount, reference } = body

    /* ---------------- VALIDATION ---------------- */
    if (!user_id || !network || !phone || !amount || !reference) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    /* ---------------- IDEMPOTENCY CHECK ---------------- */
    const { data: existingTx } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single()

    if (existingTx) {
      return Response.json({
        success: existingTx.status === 'success',
        reference: existingTx.reference,
        status: existingTx.status
      })
    }

    /* ---------------- ATOMIC DEBIT (DB FUNCTION) ---------------- */
    const { data, error } = await supabaseAdmin.rpc(
      'process_airtime_purchase',
      {
        p_user_id: user_id,
        p_amount: amount,
        p_reference: reference,
      }
    )

    if (error) {
      if (error.message.includes('INSUFFICIENT_FUNDS')) {
        return Response.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        )
      }

      if (error.message.includes('WALLET_NOT_FOUND')) {
        return Response.json(
          { error: 'Wallet not found' },
          { status: 404 }
        )
      }

      return Response.json(
        { error: 'Transaction failed' },
        { status: 500 }
      )
    }

    const { transaction_id, new_balance } = data

    try {
      /* ---------------- VTU PROVIDER CALL ---------------- */
      const providerResult = await vtuProvider.purchaseAirtime({
        network,
        phone,
        amount,
      })

      if (!providerResult.success) {
        throw new Error('VTU_PROVIDER_FAILED')
      }

      /* ---------------- PROFIT CALCULATION ---------------- */
      const cost_price = providerResult.cost_price ?? amount
      const fee = providerResult.fee ?? 0
      const profit = amount - cost_price - fee

      /* ---------------- MARK SUCCESS ---------------- */
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'success',
          cost_price,
          fee,
          profit
        })
        .eq('id', transaction_id)

      /* ---------------- AUDIT LOG ---------------- */
      await logWalletAction({
        user_id,
        action: 'airtime_purchase',
        amount,
        balance_before: new_balance + amount,
        balance_after: new_balance,
        reference,
        metadata: {
          network,
          phone
        }
      })

      return Response.json({
        success: true,
        reference,
        profit,
        new_balance
      })

    } catch (providerError) {
      console.error('❌ Provider failed:', providerError)

      /* ---------------- REFUND SAFELY ---------------- */
      await supabaseAdmin.rpc('refund_wallet_balance', {
        p_user_id: user_id,
        p_amount: amount
      })

      await supabaseAdmin
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction_id)

      return Response.json(
        { error: 'Transaction failed. Wallet refunded.' },
        { status: 500 }
      )
    }

  } catch (err) {
    console.error('❌ Server error:', err)
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}