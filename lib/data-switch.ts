import { createClient } from "@supabase/supabase-js"
import { buyData as iacafeData } from "./providers/iacafe-data"
import { clubData } from "./providers/clubkonnect"
import { cheapData } from "./providers/cheapdata"

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
  bundle_id: string
): Promise<ProviderResponse> {
  try {
    // ✅ GET ACTIVE PROVIDERS ORDERED BY PRIORITY
    const { data: providers, error } = await supabase
      .from("vtu_providers")
      .select("*")
      .eq("service", "data")
      .eq("status", "active")
      .order("priority", { ascending: true })

    if (error) {
      console.error("Provider fetch error:", error)
      return { status: "failed", message: "Provider fetch failed" }
    }

    if (!providers || providers.length === 0) {
      return { status: "failed", message: "No active provider" }
    }

    // ✅ LOOP THROUGH PROVIDERS (VERY IMPORTANT)
    for (const provider of providers) {
      try {
        let res: any = null

        // =====================
        // SWITCH PER PROVIDER
        // =====================
        if (provider.provider === "iacafe") {
          res = await iacafeData(phone, plan, amount, network)
        }

        if (provider.provider === "clubkonnect") {
          res = await clubData(phone, plan, amount, network)
        }

        if (provider.provider === "cheapdata") {
          res = await cheapData(phone, network, plan, amount)
        }

        console.log(${provider.provider} response:, res)

        // ✅ SUCCESS CHECK (NORMALIZED)
        if (res && res.status === "success") {
          return {
            status: "success",
            provider: provider.provider,
            data: res.data,
          }
        }

      } catch (err) {
        console.log(${provider.provider} failed, trying next...)
      }
    }

    // ❌ ALL FAILED
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