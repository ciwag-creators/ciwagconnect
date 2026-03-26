import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { payCable } from "@/lib/providers/vtpass"

export async function POST(req: Request) {
  try {
    const { provider, smartcard, plan, amount } = await req.json()

    const numericAmount = Number(amount)

    // ✅ Validate input
    if (
      !provider ||
      !smartcard ||
      !plan ||
      !numericAmount ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    // ✅ Fix cookies (Next.js 15)
    const cookieStore = await cookies()

    // ✅ Supabase client
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

    // ✅ Get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // ✅ Get wallet
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

    // ✅ Pricing
    const { data: pricing } = await supabase
      .from("pricing")
      .select("*")
      .eq("service", "cable")
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

    // ✅ Balance check
    if (Number(wallet.balance) < finalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    const reference = "CAB-" + Date.now()

    // ✅ Call provider (FIXED TYPE)
    const providerResponse = await payCable(
      smartcard,
      String(numericAmount), // ✅ IMPORTANT FIX
      provider,
      plan
    )

    if (providerResponse.status !== "success") {
      return NextResponse.json(
        { error: "Cable provider failed" },
        { status: 500 }
      )
    }

    // ✅ Deduct wallet AFTER success
    const newBalance =
      Number(wallet.balance) - finalAmount

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    // ✅ Save transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "cable",
      amount: numericAmount,
      charged: finalAmount,
      profit: finalAmount - numericAmount,
      reference,
      status: "success",
      provider,
      smartcard,
      plan,
      api_provider: "vtpass",
    })

    // ✅ Response
    return NextResponse.json({
      success: true,
      reference,
      provider: "vtpass",
      customer:
        providerResponse.data?.content?.Customer_Name || null,
      package:
        providerResponse.data?.content?.Package || null,
      newBalance,
    })

  } catch (error) {
    console.error("Cable API error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}