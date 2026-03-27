import { createSupabaseClient } from "./supabase/client"

export async function requireUser() {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error("Unauthorized")
  }

  return data.user
}