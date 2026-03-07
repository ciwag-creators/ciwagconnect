import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {

  const { phone, network, plan } = await req.json()

  const amount = 1000

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies:{
        get(name:string){
          return cookieStore.get(name)?.value
        },
        set(){},
        remove(){}
      }
    }
  )

  const { data:{user} } = await supabase.auth.getUser()

  if(!user){
    return NextResponse.json({error:"Unauthorized"})
  }

  const { data:wallet } = await supabase
  .from("wallets")
  .select("balance")
  .eq("user_id",user.id)
  .single()

  const balance = wallet?.balance || 0

  const { data:agent } = await supabase
  .from("agents")
  .select("level")
  .eq("user_id",user.id)
  .single()

  const level = agent?.level || "user"

  let finalPrice = amount

  if(level === "agent") finalPrice = amount * 1.05
  if(level === "super_agent") finalPrice = amount * 1.02

  if(balance < finalPrice){
    return NextResponse.json({error:"Insufficient balance"})
  }

  const newBalance = balance - finalPrice

  await supabase
  .from("wallets")
  .update({balance:newBalance})
  .eq("user_id",user.id)

  const profit = finalPrice - amount

  await supabase.from("transactions").insert({
    user_id:user.id,
    type:"data",
    network,
    phone,
    amount:finalPrice,
    profit,
    status:"success"
  })

  /* REFERRAL */

  const { data:referral } = await supabase
  .from("referrals")
  .select("referrer")
  .eq("referred_user",user.id)
  .single()

  if(referral){

    const { data:agentWallet } = await supabase
    .from("agents")
    .select("commission_balance")
    .eq("user_id",referral.referrer)
    .single()

    const newCommission = (agentWallet?.commission_balance || 0) + 50

    await supabase
    .from("agents")
    .update({commission_balance:newCommission})
    .eq("user_id",referral.referrer)

  }

  return NextResponse.json({
    success:true
  })

}