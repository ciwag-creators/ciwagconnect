import supabaseAdmin from '@/lib/supabase/admin'
import { logWalletAction } from '@/lib/vtu/audit'
import vtuProvider from '@/lib/vtu'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    /* ---------------- PARSE ---------------- */
    const user_id: string = body.user_id
    const network: string = body.network
    const phone: string = body.phone
    const plan: string = body.plan
    const reference: string = body.reference

    /* ---------------- VALIDATION ---------------- */
    if (!user_id || !network || !phone || !plan || !reference) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    /* ---------------- FETCH PLAN ---------------- */
    const { data: dataPlan } = await supabaseAdmin
      .from('data_plans')
      .select('*')
      .eq('id', plan)
      .single()

    if (!dataPlan) {
      return Response.json({ error: 'Invalid data plan' }, { status: 400 })
    }

    const amount: number = dataPlan.price

    /* ---------------- FETCH WALLET ---------------- */
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (!wallet) {
      return Response.json({ error: 'Wallet not found' }, { status: 404 })
    }

    if (wallet.balance < amount) {
      return Response.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    /* ---------------- IDEMPOTENCY ---------------- */
    const { data: existingTx } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single()

    if (existingTx) {
      return Response.json({
        success: existingTx.status === 'success',
        reference,
        status: existingTx.status,
        new_balance: wallet.balance
      })
    }

    /* ---------------- CREATE TRANSACTION ---------------- */
    const { data: transaction } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id,
        service: 'data',
        amount,
        status: 'pending',
        reference
      })
      .select()
      .single()

    try {
      /* ---------------- DEDUCT WALLET ---------------- */
      await supabaseAdmin
        .from('wallets')
        .update({ balance: wallet.balance - amount })
        .eq('id', wallet.id)

      /* ---------------- VTU PROVIDER ---------------- */
      const providerResult = await vtuProvider.purchaseData({
        network,
        phone,
        plan
      })

      if (!providerResult.success) {
        throw new Error('VTU_FAILED')
      }

      /* ---------------- PROFIT ---------------- */
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
        .eq('id', transaction.id)

      /* ---------------- AUDIT ---------------- */
      await logWalletAction({
        user_id,
        action: 'data_purchase',
        amount,
        balance_before: wallet.balance,
        balance_after: wallet.balance - amount,
        reference,
        metadata: { network, phone, plan }
      })

      return Response.json({
        success: true,
        reference,
        new_balance: wallet.balance - amount
      })

    } catch (err) {
      console.error('❌ Data VTU failed:', err)

      /* ---------------- REFUND ---------------- */
      await supabaseAdmin
        .from('wallets')
        .update({ balance: wallet.balance })
        .eq('id', wallet.id)

      await supabaseAdmin
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id)

      return Response.json(
        { error: 'Transaction failed. Wallet refunded.' },
        { status: 500 }
      )
    }

    } catch (err) {
    console.error('❌ Server error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}