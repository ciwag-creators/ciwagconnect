import { supabase } from "./supabase.js";

/**
 * Get or create wallet
 */
export async function getWallet(userId) {
  let { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!wallet) {
    const { data, error } = await supabase
      .from("wallets")
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) throw error;
    wallet = data;
  }

  return wallet;
}

/**
 * Atomic wallet debit
 */
export async function debitWallet({ walletId, amount, reference }) {
  const { error } = await supabase.rpc("debit_wallet", {
    p_wallet_id: walletId,
    p_amount: amount,
    p_reference: reference
  });

  if (error) throw error;
}
