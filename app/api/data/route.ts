import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cheapData } from "@/lib/providers/cheapdata"

export async function POST(req: Request) {
  try {
    const { network, phone, plan, amount } =
      await req.json()

    const numericAmount = Number(amount)

    if (
      !network ||
      !phone ||
      !plan ||
      !numericAmount
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      )
    }

    let finalAmount = numericAmount

    if (Number(wallet.balance) < finalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    const providerResponse = await cheapData(
      phone,
      network,
      plan,
      numericAmount
    )

    if (providerResponse.status !== "success") {
      return NextResponse.json(
        { error: "Data provider failed" },
        { status: 500 }
      )
    }

    const newBalance =
      Number(wallet.balance) - finalAmount

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    const reference = "DATA-" + Date.now()

    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "data",
      amount: numericAmount,
      charged: finalAmount,
      profit: 0,
      reference,
      status: "success",
      phone,
      plan,
      provider: "cheapdata",
    })

    return NextResponse.json({
      success: true,
      reference,
      newBalance,
    })

  } catch (error) {
    console.error("Data API Error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}