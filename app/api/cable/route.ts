import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getSupabase(){

  const cookieStore = cookies()

  return createServerClient(
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
}

export async function POST(req:Request){

  const supabase = getSupabase()

  const {provider,decoder,amount} = await req.json()

  const {
    data:{user}
  } = await supabase.auth.getUser()

  if(!user){
    return NextResponse.json({error:"Unauthorized"})
  }

  const {data:wallet} = await supabase
  .from("wallets")
  .select("balance")
  .eq("user_id",user.id)
  .single()

  if(!wallet || wallet.balance < amount){
    return NextResponse.json({error:"Insufficient balance"})
  }

  await supabase
  .from("wallets")
  .update({
    balance: wallet.balance - amount
  })
  .eq("user_id",user.id)

  await supabase
  .from("transactions")
  .insert({
    user_id:user.id,
    amount,
    service:"cable",
    type:"bill",
    status:"success"
  })

  return NextResponse.json({
    success:true
  })
}