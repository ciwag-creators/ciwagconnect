import supabaseAdmin from '@/lib/supabase/admin'

/**
 * Logs wallet-related actions (airtime, data, electricity, etc.)
 * @param {Object} params
 * @param {string} params.user_id
 * @param {string} params.action
 * @param {number} params.amount
 * @param {number} params.balance_before
 * @param {number} params.balance_after
 * @param {string} params.reference
 * @param {Record<string, any>} [params.metadata]
 */
export async function logWalletAction(params) {
  const {
    user_id,
    action,
    amount,
    balance_before,
    balance_after,
    reference,
    metadata
  } = params

  const { error } = await supabaseAdmin
    .from('wallet_audit_logs')
    .insert({
      user_id,
      action,
      amount,
      balance_before,
      balance_after,
      reference,
      metadata
    })

  if (error) {
    console.error('❌ Wallet audit log failed:', error)
  }
}