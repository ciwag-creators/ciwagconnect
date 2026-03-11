import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {

  const { amount } = await req.json()

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

  const reference = "PAY-" + Date.now()

  const paystack = await fetch("https://api.paystack.co/transaction/initialize",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
    body:JSON.stringify({
      email:user.email,
      amount: amount * 100,
      reference
    })
  })

  const data = await paystack.json()

  return NextResponse.json(data.data)
}