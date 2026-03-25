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
  amount: number,
  network: string
): Promise<ProviderResponse> {
  try {
    const { data: providers, error } = await supabase
      .from("vtu_providers")
      .select("*")
      .eq("service", "data")
      .eq("status", "active")

    if (error) {
      console.error("Provider fetch error:", error)
      return { status: "failed", message: "Provider fetch failed" }
    }

    if (!providers || providers.length === 0) {
      return {
        status: "failed",
        message: "No active provider",
      }
    }

    // =====================
    // IAcafe (Primary)
    // =====================
    const primary = providers.find(
      (p) => p.provider === "iacafe"
    )

    if (primary) {
      try {
        const res = await iacafeData(
          phone,
          plan,
          network
        )

        if (res?.status === "success") {
          return {
            status: "success",
            provider: "iacafe",
            data: res.data,
          }
        }
      } catch (err) {
        console.log("IAcafe failed, switching...")
      }
    }

    // =====================
    // ClubKonnect (Backup)
    // =====================
    const backup = providers.find(
      (p) => p.provider === "clubkonnect"
    )

    if (backup) {
      try {
        const res = await clubData(
          phone,
          plan,
          network
        )

        if (res?.status === "success") {
          return {
            status: "success",
            provider: "clubkonnect",
            data: res.data,
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
    console.error("Data switch error:", error)

    return {
      status: "failed",
      message: "Switch system error",
    }
  }
}