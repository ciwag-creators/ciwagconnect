import { NextResponse } from "next/server"

export async function POST(req: Request){

const event = await req.json()

if(event.event === "charge.success"){

const payment = event.data

const email = payment.customer.email
const amount = payment.amount / 100

// TODO: update wallet balance in database

console.log("Payment received:", email, amount)

}

return NextResponse.json({status:"ok"})

}