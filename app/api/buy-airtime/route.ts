import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { buyAirtimeSwitch } from "@/lib/airtime-switch"

export async function POST(req: Request) {
  try {
    const { network, phone, amount } = await req.json()

    const numericAmount = Number(amount)

    // Validate input
    if (!network || !phone || !numericAmount || numericAmount <= 0) {
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
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  }
)

    // Get logged-in user
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

    // Get wallet
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

    // Get pricing
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

    // Check wallet balance
    if (Number(wallet.balance) < finalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // Generate reference
    const reference = "AIR-" + Date.now()

    // Call provider
    const providerResponse = await buyAirtimeSwitch(
      phone,
      numericAmount,
      network
    )

    console.log("Provider Response:", providerResponse)

    if (!providerResponse || providerResponse.status !== "success") {
      return NextResponse.json(
        { error: "Airtime provider failed" },
        { status: 500 }
      )
    }

    // Deduct wallet
    const newBalance =
      Number(wallet.balance) - finalAmount

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    // Save transaction
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
      provider: providerResponse.provider || "iacafe",
    });

    // Referral commission
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
              Number(refWallet.balance) + commission,
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