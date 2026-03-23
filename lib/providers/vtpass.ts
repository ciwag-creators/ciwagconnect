// lib/providers/vtpass.ts

// =============================
// Electricity
// =============================
// lib/providers/vtpass.ts

export async function payElectricity(
  meter: string,
  amount: number,
  disco: string,
  meterType: string
): Promise<any> {

  const request_id = Date.now().toString()

  try {

    const res = await fetch(
      `${process.env.VTPASS_BASE_URL}/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY!,
          "secret-key": process.env.VTPASS_SECRET!,
        },
        body: JSON.stringify({
          request_id,
          serviceID: disco,
          billersCode: meter,
          variation_code: meterType,
          amount,
          phone: "08000000000",
        }),
      }
    )

    return await res.json()
  } catch (error) {
    console.error("VTPass error:", error)

    return {
      status: "failed",
      message: "PIN purchase failed",
    }
  }
}

export async function payCable(
  smartcard: string,
  amount: number,
  provider: string,
  plan: string
) {
  const request_id = Date.now().toString()

  try {
    const res = await fetch(
      `${process.env.VTPASS_BASE_URL}/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY!,
          "secret-key": process.env.VTPASS_SECRET!,
        },
        body: JSON.stringify({
          request_id,
          serviceID: provider,
          billersCode: smartcard,
          variation_code: plan,
          amount,
          phone: "08000000000",
        }),
      }
    )

    const data = await res.json()

    if (data?.code === "000") {
      return {
        status: "success",
        data,
        provider: "vtpass",
      }
    }

    return {
      status: "failed",
      data,
    }
  } catch (error) {
    console.error("Cable Provider Error:", error)

    return {
      status: "failed",
      message: "Cable payment failed",
    }
  }
}

export async function buyPin(
  serviceID: string,
  amount: number,
  quantity: number
) {
  const request_id = Date.now().toString()

  try {
    const res = await fetch(
      `${process.env.VTPASS_BASE_URL}/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.VTPASS_API_KEY!,
          "secret-key": process.env.VTPASS_SECRET!,
        },
        body: JSON.stringify({
          request_id,
          serviceID,
          amount,
          quantity,
          phone: "08000000000",
        }),
      }
    )

    const data = await res.json()

    if (data?.code === "000") {
      return {
        status: "success",
        data,
        provider: "vtpass",
      }
    }

    return {
      status: "failed",
      data,
    }
  } catch (error) {
    console.error("PIN Provider Error:", error)

    return {
      status: "failed",
      message: "PIN purchase failed",
    }
  }
}