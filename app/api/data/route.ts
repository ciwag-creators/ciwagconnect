import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cheapData } from "@/lib/providers/cheapdata"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const phone = body.phone
    const bundle_id = Number(body.bundle_id)
    const amount = Number(body.amount)

    // ✅ VALIDATION
    if (!phone  || !bundle_id || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    // ✅ INIT SUPABASE (SERVER)
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

    // ✅ AUTH CHECK
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

    // ✅ FETCH WALLET
    const { data: wallet, error: walletError } = await supabase
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

    const currentBalance = Number(wallet.balance)

    if (currentBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // ✅ CALL PROVIDER (CHEAPDATA)
    const providerResponse = await cheapData(phone, bundle_id)

    if (providerResponse.status !== "success") {
      return NextResponse.json(
        { error: providerResponse.message || "Provider failed" },
        { status: 500 }
      )
    }

    // ✅ DEDUCT WALLET
    const newBalance = currentBalance - amount

    const { error: updateError } = await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id)

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update wallet" },
        { status: 500 }
      )
    }

    // ✅ SAVE TRANSACTION
    const reference = "DATA-" + Date.now()

    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "data",
        amount: amount,
        charged: amount,
        profit: 0,
        reference,
        status: "success",
        phone,
        bundle_id,
        provider: "cheapdata",
      })

    if (txError) {
      console.error("Transaction save error:", txError)
    }

    // ✅ SUCCESS RESPONSE
    return NextResponse.json({
      success: true,
      reference,
      newBalance,
    })

  } catch (error) {
    console.error("DATA ROUTE ERROR:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}