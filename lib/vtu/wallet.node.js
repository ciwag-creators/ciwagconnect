import supabaseAdmin from '../supabase/admin.js';

/**
 * Get wallet for a user
 */
export async function getWallet(userId) {
  const { data, error } = await supabaseAdmin
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(`Wallet fetch failed: ${error.message}`);
  }

  return data;
}

/**
 * Debit wallet safely
 */
export async function debitWallet({ userId, amount }) {
  const wallet = await getWallet(userId);

  if (wallet.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }

  const newBalance = wallet.balance - amount;

  const { error } = await supabaseAdmin
    .from('wallets')
    .update({ balance: newBalance })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Wallet debit failed: ${error.message}`);
  }

  return newBalance;
}

/**
 * Credit wallet
 */
export async function creditWallet({ userId, amount }) {
  const wallet = await getWallet(userId);

  const newBalance = wallet.balance + amount;

  const { error } = await supabaseAdmin
    .from('wallets')
    .update({ balance: newBalance })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Wallet credit failed: ${error.message}`);
  }

  return newBalance;
}

/**
 * Log transaction (THIS FIXES YOUR COLUMN ERRORS)
 */
export async function createTransaction({
  userId,
  service,
  amount,
  status,
  reference,
  meta = {}
}) {
  const { error } = await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: userId,
      service,
      amount,
      status,
      reference,
      meta
    });

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }
}
