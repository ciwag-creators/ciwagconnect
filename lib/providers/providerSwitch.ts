import { buyAirtime as iacafeAirtime } from "./iacafe"
import { buyData as iacafeData } from "./iacafe-data"
import { clubAirtime, clubData } from "./clubkonnect"
import { cheapData } from "./cheapdata"
import { cheapAirtime } from "./cheapdata"

type ProviderResponse = {
  status: string
  provider?: string
  reference?: string
  message?: string
}

export async function providerSwitchAirtime(
  phone: string,
  amount: number,
  network: string
): Promise<ProviderResponse> {
  try {
    // =====================
    // 1. CHEAPDATA (PRIMARY)
    // =====================
    const cheap = await cheapAirtime(phone, network, amount)

    if (cheap?.status === "success") {
      return {
        status: "success",
        provider: "cheapdata",
        reference: cheap.reference,
        message: cheap.message,
      }
    }

    // =====================
    // 2. IACAFE (BACKUP)
    // =====================
    const iacafe = await iacafeAirtime(
      phone,
      network,
      amount
    )

    if (iacafe?.status === "success") {
      return {
        status: "success",
        provider: "iacafe",
        reference: iacafe.reference,
        message: iacafe.message,
      }
    }

    // =====================
    // 3. CLUBKONNECT (FALLBACK)
    // =====================
    const club = await clubAirtime(phone, network, amount)

    if (club?.status === "success") {
      return {
        status: "success",
        provider: "clubkonnect",
        reference: club.reference,
        message: club.message,
      }
    }

    return {
      status: "failed",
      message: "All airtime providers failed",
    }
  } catch (error) {
    console.error("Airtime switch error:", error)

    return {
      status: "failed",
      message: "Airtime switch system error",
    }
  }
}


// =====================
// DATA SWITCH
// =====================
export async function providerSwitchData(
  phone: string,
  bundle_id: number,
  network: string
): Promise<ProviderResponse> {
  try {
    // =====================
    // 1. CHEAPDATA
    // =====================
    const cheap = await cheapData(phone, bundle_id)

    if (cheap?.status === "success") {
      return {
        status: "success",
        provider: "cheapdata",
        reference: cheap.reference,
        message: cheap.message,
      }
    }

    // =====================
    // 2. IACAFE
    // =====================
    const iacafe = await iacafeData(phone, bundle_id, network)

    if (iacafe?.status === "success") {
      return {
        status: "success",
        provider: "iacafe",
        reference: iacafe.reference,
        message: iacafe.message,
      }
    }

    // =====================
    // 3. CLUBKONNECT
    // =====================
    const club = await clubData(phone, bundle_id, network)

    if (club?.status === "success") {
      return {
        status: "success",
        provider: "clubkonnect",
        reference: club.reference,
        message: club.message,
      }
    }

    return {
      status: "failed",
      message: "All data providers failed",
    }

  } catch (error) {
    console.error("Data switch error:", error)

    return {
      status: "failed",
      message: "Data switch system error",
    }
  }
}