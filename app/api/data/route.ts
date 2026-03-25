import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { buyDataSwitch } from "@/lib/data-switch"

export async function POST(req: Request) {
  try {
    const { network, phone, plan, amount } =
      await req.json()

    const numericAmount = Number(amount)

    if (
      !network ||
      !phone ||
      !plan ||
      !numericAmount ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return (await cookieStore).get(name)?.value
          },
          set() {},
          remove() {},
        },
      }
    )

    // logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // wallet
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

    // pricing
    const { data: pricing } = await supabase
      .from("pricing")
      .select("*")
      .eq("service", "data")
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

    // balance check
    if (Number(wallet.balance) < finalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    const reference = "DATA-" + Date.now()

    // provider switch
    const providerResponse =
      await buyDataSwitch(
        phone,
        plan,
        numericAmount,
        network
      )

    if (
      !providerResponse ||
      providerResponse.status !== "success"
    ) {
      return NextResponse.json(
        { error: "Data provider failed" },
        { status: 500 }
      )
    }

    // deduct wallet
    const newBalance =
      Number(wallet.balance) - finalAmount

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    // save transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "data",
      amount: numericAmount,
      charged: finalAmount,
      profit: finalAmount - numericAmount,
      reference,
      status: "success",
      phone,
      plan,
      provider: providerResponse.provider,
    })

    // referral commission
    const { data: referral } = await supabase
      .from("referrals")
      .select("*")
      .eq("referred_id", user.id)
      .single()

    if (referral) {
      const commission = finalAmount * 0.02

      const { data: refWallet } =
        await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", referral.referrer_id)
          .single()

      if (refWallet) {
        await supabase
          .from("wallets")
          .update({
            balance:
              Number(refWallet.balance) +
              commission,
          })
          .eq("user_id", referral.referrer_id)

        await supabase
          .from("referrals")
          .update({
            bonus:
              Number(referral.bonus || 0) +
              commission,
          })
          .eq("id", referral.id)
      }
    }

    return NextResponse.json({
      success: true,
      reference,
      provider: providerResponse.provider,
    })
  } catch (error) {
    console.error("Data API error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}