import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cheapAirtime } from "@/lib/providers/cheapdata"

export async function POST(req: Request) {
  try {
    const { network, phone, amount } = await req.json()

    const numericAmount = Number(amount)

    // ✅ VALIDATION
    if (
      !network ||
      !phone ||
      !numericAmount ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    // ✅ AUTH
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

    // ✅ WALLET
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

    // ✅ PRICING
    const { data: pricing } = await supabase
      .from("pricing")
      .select("*")
      .eq("service", "airtime")
      .single()

    let finalAmount = numericAmount

    if (pricing?.type === "percentage") {
      finalAmount +=
        (numericAmount * Number(pricing.margin)) / 100
    }

    if (pricing?.type === "flat") {
      finalAmount += Number(pricing.margin)
    }

    if (Number(wallet.balance) < finalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // ✅ CALL CHEAPDATA
    const providerResponse = await cheapAirtime(
      phone,
      network,
      numericAmount
    )

    if (providerResponse.status !== "success") {
      return NextResponse.json(
        { error: "Airtime provider failed" },
        { status: 500 }
      )
    }

    // ✅ DEDUCT WALLET
    const newBalance =
      Number(wallet.balance) - finalAmount

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    // ✅ SAVE TRANSACTION
    const reference = "AIR-" + Date.now()

    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "airtime",
      amount: numericAmount,
      charged: finalAmount,
      profit: finalAmount - numericAmount,
      reference,
      status: "success",
      network,
      phone,
      provider: "cheapdata",
    })

    return NextResponse.json({
      success: true,
      reference,
      newBalance,
    })

  } catch (error) {
    console.error("Airtime API Error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}