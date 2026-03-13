import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const { email, amount } = await req.json()

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
        body: JSON.stringify({
          email: email,
          amount: amount * 100,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`
        })
      }
    )

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {

    console.error("Paystack error:", error)

    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    )

  }

}