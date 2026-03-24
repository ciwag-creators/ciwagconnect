import { createClient } from "@supabase/supabase-js"
import { buyData as iacafeData } from "./providers/iacafe-data"
import { clubData } from "./providers/clubkonnect"

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

export async function buyDataSwitch(
  phone: string,
  plan: string,
  network: string
) {
  const res = await buyData(
    phone,
    plan,
    amount,
    network
  )

  if (res?.status === "success") {
    return {
      ...res,
      provider: "iacafe",
    }
  }

    return {
      status: "failed",
      message: "Switch system error",
    }
  }
}