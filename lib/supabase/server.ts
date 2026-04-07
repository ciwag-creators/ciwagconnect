import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createSupabaseServer() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string) {
          (await cookieStore).set(name, value)
        },
        async remove(name: string) {
          (await cookieStore).set(name, "")
        },
      },
    }
  )
}