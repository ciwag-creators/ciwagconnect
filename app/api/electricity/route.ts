import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const { disco, meter, amount } = body

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
      return NextResponse.json({ error: "Unauthorized" })
    }

    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    const balance = wallet?.balance || 0

    if (balance < amount) {
      return NextResponse.json({
        error: "Insufficient wallet balance",
      })
    }

    const newBalance = balance - amount

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    await supabase.from("transactions").insert({
      user_id: user.id,
      service: "electricity",
      provider: disco,
      amount: amount,
      meter: meter,
      status: "success",
      type: "electricity",
    })

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.log("Electricity error:", error)

    return NextResponse.json({
      error: "Something went wrong",
    })
  }

}