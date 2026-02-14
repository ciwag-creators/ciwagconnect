// lib/vtu/getWallet.js
import supabaseAdmin from '../lib/supabase/admin.js';

/**
 * Get wallet info for a user
 * @param {string} userId
 * @returns {Promise<Object|null>} wallet object or null if not found
 */
export async function getWallet(userId) {
  const { data, error } = await supabaseAdmin
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single(); // expects only one wallet per user

  if (error) {
    console.error('❌ Failed to fetch wallet:', error.message);
    return null;
  }

  return data;
}
