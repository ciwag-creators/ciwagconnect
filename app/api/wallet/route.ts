import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {

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

  if (!user) {
    return NextResponse.json({ balance: 0 })
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single()

  return NextResponse.json({
    balance: wallet?.balance ?? 0,
  })
}

export async function POST(req: Request) {

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

  const body = await req.json()
  const amount = Number(body.amount)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" })
  }

  // get current balance
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single()

  const currentBalance = wallet?.balance ?? 0
  const newBalance = currentBalance + amount

  // update wallet
  await supabase
    .from("wallets")
    .update({ balance: newBalance })
    .eq("user_id", user.id)

  // record transaction
  await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      amount,
      type: "funding",
      status: "success",
    })

  return NextResponse.json({
    success: true,
    balance: newBalance,
  })
}