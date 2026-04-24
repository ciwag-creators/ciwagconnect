import { cheapAirtime } from "./providers/cheapdata"

export async function buyAirtimeSwitch(
  phone: string,
  amount: number,
  network: string
) {
  try {
    const res = await cheapAirtime(
      phone,
      network,
      amount
    )

    if (res?.status === "success") {
      return res
    }

    return {
      status: "failed",
      message: "CheapData failed",
    }
  } catch (error) {
    return {
      status: "failed",
      message: "Switch error",
    }
  }
}