import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { buyPin } from "@/lib/providers/vtpass"

export async function POST(req: Request) {
  try {
    const {
      serviceID,
      amount,
      quantity
    } = await req.json()

    const numericAmount = Number(amount)
    const qty = Number(quantity)

    if (
      !serviceID ||
      !numericAmount ||
      numericAmount <= 0 ||
      !qty ||
      qty <= 0
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
      .eq("service", "pins")
      .single()

    let finalAmount = numericAmount * qty

    if (pricing?.type === "percentage") {
      finalAmount =
        finalAmount +
        (finalAmount * Number(pricing.margin)) / 100
    }

    if (pricing?.type === "flat") {
      finalAmount =
        finalAmount + Number(pricing.margin)
    }

    // balance check
    if (Number(wallet.balance) < finalAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    const reference = "PIN-" + Date.now()

    // call provider
    const providerResponse = await buyPin(
      serviceID,
      numericAmount,
      qty
    )

    if (providerResponse.status !== "success") {
      return NextResponse.json(
        { error: "PIN provider failed" },
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
      type: "pins",
      amount: numericAmount,
      quantity: qty,
      charged: finalAmount,
      profit:
        finalAmount - numericAmount * qty,
      reference,
      status: "success",
      serviceID,
      api_provider: "vtpass",
    })

    return NextResponse.json({
      success: true,
      reference,
      pins:
        providerResponse.data?.pins ||
        providerResponse.data?.content,
    })
  } catch (error) {
    console.error("PIN API error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}