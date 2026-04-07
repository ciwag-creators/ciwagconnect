import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {

  try {

    const body = await request.json()

    const email = body.email
    const password = body.password

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )

    const { data, error } = await supabase.auth.signInWithPassword({

      email,
      password

    })

    if (error) {

      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )

    }

    return NextResponse.json({

      message: "Login successful",

      user: data.user,

      session: data.session

    })

  } catch (err) {

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )

  }

}