const { supabaseAdmin } = require('../supabase/admin.js')
const { getActiveProvider } = require('./providers.node.js') // make sure providers.js exists

async function buyAirtime(userId, network, phone, amount) {
  // 1️⃣ Debit wallet
  const { error: debitError } = await supabaseAdmin.rpc('debit_wallet', {
    p_user_id: userId,
    p_amount: amount
  })

  if (debitError) {
    throw new Error('Insufficient balance')
  }

  const reference = crypto.randomUUID()

  // 2️⃣ Create transaction row
  await supabaseAdmin.from('transactions').insert({
    user_id: userId,
    type: 'airtime',
    amount,
    provider: network,
    reference,
    status: 'pending'
  })

  // 3️⃣ Mock VTU provider call
  const provider = await getActiveProvider()
  const providerResult = { success: true } // replace with real API call later

  // 4️⃣ Update transaction status
  await supabaseAdmin
    .from('transactions')
    .update({ status: providerResult.success ? 'success' : 'failed' })
    .eq('reference', reference)

  // 5️⃣ Refund if failed
  if (!providerResult.success) {
    await supabaseAdmin.rpc('credit_wallet', {
      p_user_id: userId,
      p_amount: amount
    })
    throw new Error('Airtime purchase failed')
  }

  return { success: true, reference }
}

module.exports = { buyAirtime }
