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
      return primary
    }

    throw new Error("IAcafe failed")

  } catch {

    return await clubAirtime(
      phone,
      amount,
      network
    )
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
      return primary
    }

    throw new Error("IAcafe failed")

  } catch {

    return await clubData(
      phone,
      plan,
      amount,
      network
    )
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
  return buyElectricityVtpass(
    meter,
    amount,
    disco,
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
    amount,
    plan
  )
}