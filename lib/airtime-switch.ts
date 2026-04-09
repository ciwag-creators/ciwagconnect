import { createClient } from "@supabase/supabase-js"
import { buyAirtime as iacafeAirtime } from "./providers/iacafe"
import { buyAirtime as clubAirtime } from "./providers/clubkonnect"

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
    const { data: providers, error } = await supabase
      .from("vtu_providers")
      .select("*")
      .eq("service", "airtime")
      .eq("status", "active")

    if (error) {
      console.error("Provider fetch error:", error)

      return {
        status: "failed",
        message: "Provider fetch failed",
      }
    }

    if (!providers || providers.length === 0) {
      return {
        status: "failed",
        message: "No provider available",
      }
    }

    // ======================
    // IAcafe (Primary)
    // ======================
    const primary = providers.find(
      (p) => p.provider === "iacafe"
    )

    if (primary) {
      try {
        console.log("Trying IAcafe...")

        const res = await iacafeAirtime(
          phone,
          network,
          amount
        )

        console.log("IAcafe Response:", res)

     const success =
  res?.status === "success" ||
  res?.status === "successful" ||
  (res as any)?.code === "200"

if (success) {
  return {
    status: "success",
    provider: "IAcafe",
    data: res,
  }
}
      } catch (err) {
        console.log("IAcafe failed, switching...")
      }
    }

    // ======================
    // ClubKonnect (Backup)
    // ======================
    const backup = providers.find(
      (p) => p.provider === "clubkonnect"
    )

    if (backup) {
      try {
        console.log("Trying ClubKonnect...")

        const res = await clubAirtime(
          phone,
          network,
          amount
        )

        console.log("ClubKonnect Response:", res)

        const success =
  res?.status === "success" ||
  res?.status === "successful" ||
  (res as any)?.code === "200"

if (success) {
  return {
    status: "success",
    provider: "ClubKonnect",
    data: res,
  }
}
      } catch (err) {
        console.log("ClubKonnect failed")
      }
    }

    return {
      status: "failed",
      message: "All providers failed",
    }
  } catch (error) {
    console.error("Airtime switch error:", error)

    return {
      status: "failed",
      message: "Switch system error",
    }
  }
}