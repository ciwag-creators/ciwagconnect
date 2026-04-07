import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const body = await req.text()

    const signature = req.headers.get(
      "x-paystack-signature"
    )

    const hash = crypto
      .createHmac(
        "sha512",
        process.env.PAYSTACK_SECRET_KEY!
      )
      .update(body)
      .digest("hex")

    if (!signature || hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    // Only process successful charge
    if (event.event !== "charge.success") {
      return NextResponse.json({
        received: true,
      })
    }

    const reference =
      event.data?.reference

    const amount =
      Number(event.data?.amount || 0) / 100

    const email =
      event.data?.customer?.email

    if (!reference || !email || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // prevent duplicate funding
    const { data: existingTx } =
      await supabase
        .from("transactions")
        .select("id")
        .eq("reference", reference)
        .maybeSingle()

    if (existingTx) {
      return NextResponse.json({
        received: true,
      })
    }

    // find user
    const {
      data: usersData,
      error: usersError,
    } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error(usersError)

      return NextResponse.json(
        { error: "User lookup failed" },
        { status: 500 }
      )
    }

    const authUser =
      usersData.users.find((u: any) =>
        u.email
          ?.toLowerCase()
          .includes(email.toLowerCase())
      )

    if (!authUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userId = authUser.id

    // get wallet
    const { data: wallet } =
      await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .single()

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      )
    }

    const newBalance =
      Number(wallet.balance) + amount

    // update wallet
    await supabase
      .from("wallets")
      .update({
        balance: newBalance,
      })
      .eq("user_id", userId)

    // save transaction
    await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type: "wallet_funding",
        amount,
        charged: amount,
        profit: 0,
        reference,
        status: "success",
        api_provider: "paystack",
      })

    return NextResponse.json({
      received: true,
    })
  } catch (error) {
    console.error(
      "Webhook error:",
      error
    )

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}