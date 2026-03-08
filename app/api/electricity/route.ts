import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req:Request){

  const { disco, meter, amount } = await req.json()

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
    return NextResponse.json({ error:"Unauthorized" })
  }

  const { data: wallet } = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id",user.id)
  .single()

  const { data: pricing } = await supabase
  .from("pricing")
  .select("*")
  .eq("service","electricity")
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
    type:"electricity",
    amount:Number(amount),
    charged:finalAmount,
    profit:finalAmount - Number(amount),
    reference
  })

  return NextResponse.json({
    success:true,
    reference
  })

}