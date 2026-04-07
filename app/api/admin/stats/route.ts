import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(){

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

  const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("user_id",user.id)
  .single()

  if(!profile?.is_admin){
    return NextResponse.json({ error:"Admin only" })
  }

  const { count: users } = await supabase
  .from("profiles")
  .select("*",{ count:"exact", head:true })

  const { count: transactions } = await supabase
  .from("transactions")
  .select("*",{ count:"exact", head:true })

  const { data: profits } = await supabase
  .from("transactions")
  .select("profit")

  let totalProfit = 0

  profits?.forEach(t=>{
    totalProfit += Number(t.profit)
  })

  return NextResponse.json({
    users,
    transactions,
    profit:totalProfit
  })

}