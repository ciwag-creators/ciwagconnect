// lib/vtu/data.node.js
import supabaseAdmin from '../lib/supabase/admin.js';

/**
 * Fetch a specific data plan by plan_name or ID
 */
export async function getDataPlan({ planId, planName }) {
  const query = supabaseAdmin.from('data_plans').select('*');
  
  if (planId) query.eq('id', planId).single();
  if (planName) query.eq('plan_name', planName).single();

  const { data, error } = await query;

  if (error) {
    console.error('❌ Failed to fetch data plan:', error.message);
    return null;
  }

  return data;
}

/**
 * Get all active plans for a network
 */
export async function getActivePlans(network) {
  const { data, error } = await supabaseAdmin
    .from('data_plans')
    .select('*')
    .eq('network', network)
    .eq('active', true);

  if (error) {
    console.error('❌ Failed to fetch active plans:', error.message);
    return [];
  }

  return data;
}

/**
 * Example: get active provider (for VTU, similar to airtime)
 */
export async function getActiveProvider() {
  // Replace with real selection logic
  return { name: 'VTU Provider 1', code: 'VTU1' };
}
