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

  const { data } = await supabase
  .from("transactions")
  .select("*")
  .order("created_at",{ ascending:false })
  .limit(50)

  return NextResponse.json(data)

}