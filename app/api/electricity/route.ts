import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {

  try {

    const { disco, meter, amount } = await req.json()

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
      service:"electricity",
      provider:disco,
      meter,
      amount:finalPrice,
      profit,
      status:"success",
      type:"electricity"
    })

    return NextResponse.json({
      success:true
    })

  } catch(error){

    console.log("Electricity error:",error)

    return NextResponse.json({
      error:"Something went wrong"
    })

  }

}