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

    const data = await res.json()

    return data

  } catch (error) {

    console.error("Electricity Provider Error:", error)

    return {
      status: "failed",
      message: "Electricity payment failed"
    }
  }
}

// =============================
// Cable
// =============================
export async function payCable(
  provider: string,
  smartcard: string,
  amount: number,
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


// =============================
// PIN
// =============================
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