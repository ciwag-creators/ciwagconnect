import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { buyAirtimeSwitch } from "@/lib/airtime-switch"

export async function POST(req: Request) {
  try {
    const { network, phone, amount } = await req.json()

    const numericAmount = Number(amount)

    if (!network || !phone || !numericAmount || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServer()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: wallet, error: walletError } =
      await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single()

    if (walletError || !wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      )
    }

    const { data: pricing } = await supabase
      .from("pricing")
      .select("*")
      .eq("service", "airtime")
      .single()

    let finalAmount = numericAmount

    if (pricing?.type === "percentage") {
      finalAmount =
        numericAmount +
        (numericAmount * Number(pricing.margin)) / 100
    }

    if (pricing?.type === "flat") {
      finalAmount =
        numericAmount + Number(pricing.margin)
    }

    if (Number(wallet.balance) < finalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    const reference = "AIR-" + Date.now()

    const providerResponse = await buyAirtimeSwitch(
      phone,
      numericAmount,
      network
    )

    if (!providerResponse || providerResponse.status !== "success") {
      return NextResponse.json(
        { error: "Airtime provider failed" },
        { status: 500 }
      )
    }

    const newBalance =
      Number(wallet.balance) - finalAmount

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "airtime",
      amount: numericAmount,
      charged: finalAmount,
      profit: finalAmount - numericAmount,
      reference,
      status: "success",
      phone,
      network,
      provider: providerResponse.provider ?? "iacafe",
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