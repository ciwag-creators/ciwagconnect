import { createSupabaseClient } from "./supabase/client"

export async function requireUser() {
  const supabase = createSupabaseClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  return user
}