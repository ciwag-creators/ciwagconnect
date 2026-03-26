import { buyAirtime as iacafeAirtime } from "./iacafe"
import { buyData as iacafeData } from "./iacafe-data"
import { clubAirtime, clubData } from "./clubkonnect"
import {
  payElectricity as buyElectricityVtpass,
  payCable as buyCableVtpass,
} from "./vtpass"

// =============================
// Airtime
// =============================
export async function buyAirtime(
  network: string,
  phone: string,
  amount: number
): Promise<any> {
  try {
    const primary = await iacafeAirtime(
      phone,
      network,
      amount
    )

    if (primary?.status === "success") {
      return {
        status: "success",
        provider: "iacafe",
        data: primary.data,
      }
    }

    console.log("IAcafe failed, switching to ClubKonnect...")
  } catch (err) {
    console.log("IAcafe error:", err)
  }

  // fallback
  const fallback = await clubAirtime(
    phone,
    amount,
    network
  )

  if (fallback?.status === "success") {
    return fallback
  }

  return {
    status: "failed",
    message: "All providers failed",
  }
}

// =============================
// Data
// =============================
export async function buyData(
  network: string,
  phone: string,
  plan: string,
  amount: number
): Promise<any> {
  try {
    const primary = await iacafeData(
      phone,
      plan,
      amount,
      network
    )

    if (primary?.status === "success") {
      return {
        status: "success",
        provider: "iacafe",
        data: primary.data,
      }
    }

    console.log("IAcafe data failed, switching...")
  } catch (err) {
    console.log("IAcafe data error:", err)
  }

  // fallback
  const fallback = await clubData(
    phone,
    plan,
    amount,
    network
  )

  if (fallback?.status === "success") {
    return fallback
  }

  return {
    status: "failed",
    message: "All providers failed",
  }
}

// =============================
// Electricity
// =============================
export async function buyElectricity(
  disco: string,
  meter: string,
  amount: number,
  meterType: string
) {
  return await buyElectricityVtpass(
    disco,
    meter,
    amount, // ✅ FIX: vtpass expects string
    meterType
  )
}

// =============================
// Cable
// =============================
export async function buyCable(
  provider: string,
  smartcard: string,
  amount: number,
  plan: string
) {
  return await buyCableVtpass(
    provider,
    smartcard,
    amount, // ✅ FIX: vtpass expects string
    plan
  )
}