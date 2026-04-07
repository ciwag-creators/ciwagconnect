import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST() {

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {},
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: agent } = await supabase
    .from("agents")
    .select("commission_balance")
    .eq("user_id", user?.id)
    .single()

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" })
  }

  const commission = agent.commission_balance

  if (commission <= 0) {
    return NextResponse.json({ error: "No commission available" })
  }

  await supabase
    .from("wallets")
    .update({
      balance: commission
    })
    .eq("user_id", user?.id)

  await supabase
    .from("agents")
    .update({
      commission_balance: 0
    })
    .eq("user_id", user?.id)

  return NextResponse.json({
    success: true,
  })
}