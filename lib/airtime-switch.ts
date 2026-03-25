import { createClient } from "@supabase/supabase-js"
import { buyAirtime as iacafeAirtime } from "./providers/iacafe"
import { clubAirtime } from "./providers/clubkonnect"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type ProviderResponse = {
  status: string
  provider?: string
  data?: any
  message?: string
}

export async function buyAirtimeSwitch(
  phone: string,
  amount: number,
  network: string
): Promise<ProviderResponse> {
  try {
    const res = await iacafeAirtime(
      phone,
      network,
      amount
      
    )

    if (res?.status === "success") {
      return {
        ...res,
        provider: "iacafe",
      }
    }

    throw new Error("IAcafe failed")
  } catch (error) {
    console.log(
      "IAcafe failed, switching to ClubKonnect"
    )

    const res = await clubAirtime(
      phone,
      amount,
      network
    )

    return {
      status: "failed",
      message: "Switch system error",
    }
  }
}