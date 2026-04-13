import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { payElectricity } from "@/lib/providers/vtpass"

export async function POST(req: Request) {
  try {
    const { disco, meter, amount, meterType } =
      await req.json()

    const numericAmount = Number(amount)

    if (
      !disco ||
      !meter ||
      !meterType ||
      !numericAmount ||
      numericAmount <= 0
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

    // get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // get wallet
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
      .eq("service", "electricity")
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

    const reference = "ELE-" + Date.now()

    // call provider
    const providerResponse =
      await payElectricity(
        meter,
        numericAmount,
        disco,
        meterType
      )

    if (providerResponse.status !== "success") {
      return NextResponse.json(
        { error: "Electricity provider failed" },
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
      type: "electricity",
      amount: numericAmount,
      charged: finalAmount,
      profit: finalAmount - numericAmount,
      reference,
      status: "success",
      disco,
      meter,
      meterType,
      provider: "vtpass",
    })

    return NextResponse.json({
      success: true,
      reference,
      provider: "vtpass",
      token: providerResponse.data?.token,
      units: providerResponse.data?.units,
    })
  } catch (error) {
    console.error("Electricity API error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}