import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

export async function POST(req:Request){

  const body = await req.text()

  const hash = crypto
  .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
  .update(body)
  .digest("hex")

  const signature = req.headers.get("x-paystack-signature")

  if(hash !== signature){
    return NextResponse.json({ error:"Invalid signature" })
  }

  const event = JSON.parse(body)

  if(event.event === "charge.success"){

    const reference = event.data.reference
    const amount = event.data.amount / 100
    const email = event.data.customer.email

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data:user } = await supabase
    .from("profiles")
    .select("*")
    .eq("email",email)
    .single()

    const { data:wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id",user.user_id)
    .single()

    await supabase
    .from("wallets")
    .update({
      balance: wallet.balance + amount
    })
    .eq("user_id",user.user_id)

    await supabase
    .from("transactions")
    .insert({
      user_id:user.user_id,
      type:"wallet_funding",
      amount,
      reference,
      status:"success"
    })

  }

  return NextResponse.json({ received:true })

}