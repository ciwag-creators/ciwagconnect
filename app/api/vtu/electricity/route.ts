import { NextResponse } from 'next/server'
import { getActiveProvider } from '@/lib/getActiveProvider'

type ElectricityRequest = {
  meterNumber: string
  disco: string
  amount: number
}

export async function POST(req: Request) {
  try {
    const body: ElectricityRequest = await req.json()
    const { meterNumber, disco, amount } = body

    // basic validation
    if (!meterNumber || !disco || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // get provider (mock or real)
    const provider = await getActiveProvider()

    // buy electricity
    const result = await provider.buyData({
      meterNumber,
      disco,
      amount,
      service: 'electricity',
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Electricity API error:', error)

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}