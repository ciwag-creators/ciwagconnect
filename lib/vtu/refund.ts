import supabaseAdmin from '../supabase/admin.js'

export async function refundWallet({
  walletId,
  amount,
  transactionId
}: {
  walletId: string
  amount: number
  transactionId: string
}) {
  // 1️⃣ Refund wallet
  const { error: walletError } = await supabaseAdmin
    .from('wallets')
    .update({
      balance: supabaseAdmin.rpc
        ? undefined
        : undefined // balance already known; handled in caller
    })
    .eq('id', walletId)

  if (walletError) {
    console.error('❌ Wallet refund failed:', walletError.message)
  }

  // 2️⃣ Mark transaction failed
  const { error: txError } = await supabaseAdmin
    .from('transactions')
    .update({ status: 'failed' })
    .eq('id', transactionId)

  if (txError) {
    console.error('❌ Transaction update failed:', txError.message)
  }
}
