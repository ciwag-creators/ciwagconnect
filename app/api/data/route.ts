import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {

  const { network, phone, amount } = await req.json()

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies:{
        async get(name:string){
          return (await cookieStore).get(name)?.value
        },
        set(){},
        remove(){}
      }
    }
  )

  const { data:{ user } } = await supabase.auth.getUser()

  if(!user){
    return NextResponse.json({ error:"Unauthorized" },{ status:401 })
  }

  const { data: wallet } = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id",user.id)
  .single()

  const { data: pricing } = await supabase
  .from("pricing")
  .select("*")
  .eq("service","airtime")
  .single()

  let finalAmount = Number(amount)

  if(pricing?.type === "percentage"){
    finalAmount = Number(amount) + (Number(amount) * pricing.margin)/100
  }

  if(pricing?.type === "flat"){
    finalAmount = Number(amount) + pricing.margin
  }

  if(wallet.balance < finalAmount){
    return NextResponse.json({ error:"Insufficient balance" })
  }

  const newBalance = wallet.balance - finalAmount

  await supabase
  .from("wallets")
  .update({ balance:newBalance })
  .eq("user_id",user.id)

  const reference = "TXN-" + Date.now()

  await supabase.from("transactions").insert({
    user_id:user.id,
    type:"airtime",
    amount:Number(amount),
    charged:finalAmount,
    profit:finalAmount - Number(amount),
    reference
  })

  /* REFERRAL COMMISSION */

  const { data: referral } = await supabase
  .from("referrals")
  .select("*")
  .eq("referred_id", user.id)
  .single()

  if(referral){

    const commission = finalAmount * 0.02

    const { data: refWallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", referral.referrer_id)
    .single()

    await supabase
    .from("wallets")
    .update({
      balance: refWallet.balance + commission
    })
    .eq("user_id", referral.referrer_id)

    await supabase
    .from("referrals")
    .update({
      commission: referral.commission + commission
    })
    .eq("id", referral.id)
  }

  return NextResponse.json({
    success:true,
    reference
  })

}