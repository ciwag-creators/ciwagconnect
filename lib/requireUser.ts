import supabase from './supabase/client'

export async function requireUser() {

  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    throw new Error('Unauthorized')
  }

  return data.user
}
