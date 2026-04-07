import 'dotenv/config'
import supabaseAdmin from '../lib/supabase/admin.js'

const TEST_USER_ID = process.env.TEST_USER_ID

if (!TEST_USER_ID) {
  console.error('❌ TEST_USER_ID not set in .env.local')
  process.exit(1)
}

async function fetchWallet() {
  const { data, error } = await supabaseAdmin
    .from('wallets')
    .select('*')
    .eq('user_id', TEST_USER_ID)
    .maybeSingle()

  if (error) {
    throw new Error(`Wallet fetch failed: ${error.message}`)
  }

  if (!data) {
    throw new Error('Wallet does not exist for this user')
  }

  return data
}

async function createTransaction({ amount, service }) {
  const reference = `VTU-${service.toUpperCase()}-${Date.now()}`

  const { error } = await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: TEST_USER_ID,
      amount,
      service,        // 'airtime' | 'data'
      status: 'success',
      reference
    })

  if (error) {
    throw new Error(`Transaction insert failed: ${error.message}`)
  }

  return reference
}

async function deductWallet(wallet, amount) {
  if (wallet.balance < amount) {
    throw new Error('Insufficient wallet balance')
  }

  const { error } = await supabaseAdmin
    .from('wallets')
    .update({ balance: wallet.balance - amount })
    .eq('id', wallet.id)

  if (error) {
    throw new Error(`Wallet update failed: ${error.message}`)
  }
}

async function runVTUTest() {
  console.log('🚀 VTU TEST START')

  // 1️⃣ Fetch wallet
  const wallet = await fetchWallet()
  console.log('💰 Wallet balance:', wallet.balance)

  // 2️⃣ AIRTIME TEST
  console.log('📞 Testing Airtime Purchase...')
  await createTransaction({ amount: 500, service: 'airtime' })
  await deductWallet(wallet, 500)
  console.log('✅ Airtime purchase successful')

  // Refresh wallet after airtime
  const walletAfterAirtime = await fetchWallet()

  // 3️⃣ DATA TEST
  console.log('📡 Testing Data Purchase...')
  await createTransaction({ amount: 1000, service: 'data' })
  await deductWallet(walletAfterAirtime, 1000)
  console.log('✅ Data purchase successful')

  // Final wallet
  const finalWallet = await fetchWallet()
  console.log('🏁 Final wallet balance:', finalWallet.balance)

  console.log('🎉 VTU TEST COMPLETED SUCCESSFULLY')
}

runVTUTest().catch(err => {
  console.error('❌ VTU TEST FAILED:', err.message)
})
