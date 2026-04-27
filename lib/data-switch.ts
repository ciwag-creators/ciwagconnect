import { createClient } from "@supabase/supabase-js"
import { buyData as iacafeData } from "./providers/iacafe-data"
import { clubAirtime } from "./providers/clubkonnect"
import { cheapData } from "./providers/cheapdata"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type ProviderResponse = {
  status: string
  provider?: string
  reference?: string
  message?: string
}

export async function buyDataSwitch(
  phone: string,
  bundle_id: number
): Promise<ProviderResponse> {
  try {
    // ✅ FETCH ACTIVE PROVIDERS (ORDERED)
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

    // ✅ LOOP THROUGH PROVIDERS
    for (const provider of providers) {
      try {
        let res: any = null

        // =====================
        // PROVIDER SWITCH
        // =====================

        if (provider.provider === "cheapdata") {
  res = await cheapData(phone, bundle_id)
}

if (provider.provider === "iacafe") {
  res = await iacafeData(phone, bundle_id, provider.network)
}

if (provider.provider === "clubkonnect") {
  res = await clubAirtime(phone, provider.network, bundle_id)
}

        console.log(`${provider.provider} response:`, res)

        // ✅ NORMALIZED SUCCESS CHECK
        if (res && res.status === "success") {
          return {
            status: "success",
            provider: provider.provider,
            reference: res.reference,
            message: res.message,
          }
        }

      } catch (err) {
        console.log(`${provider.provider} failed, trying next...`)
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