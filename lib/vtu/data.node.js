// lib/vtu/data.node.js
import supabaseAdmin from '../supabase/admin.js'

// Fetch a specific data plan by ID
export async function getDataPlan(planId) {
  const { data, error } = await supabaseAdmin
    .from('data_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (error) return null
  return data
}

// Get all active plans for a network
export async function getActivePlans(network) {
  const { data } = await supabaseAdmin
    .from('data_plans')
    .select('*')
    .eq('network', network)
    .eq('active', true)

  return data
}

// Example: get active provider
export async function getActiveProvider() {
  return { name: 'VTU Provider 1', code: 'VTU1' }
}
