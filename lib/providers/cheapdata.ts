export async function cheapAirtime(
  phone: string,
  network: string,
  amount: number
) {
  try {
    const providerMap: Record<string, number> = {
      mtn: 1,
      airtel: 2,
      glo: 3,
      "9mobile": 4,
    }

    const provider_id = providerMap[network.toLowerCase()]

    if (!provider_id) {
      return { status: "failed", message: "Invalid network" }
    }

    const res = await fetch(
      "https://www.cheapdatahub.ng/api/v1/resellers/airtime/purchase/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`,
        },
        body: JSON.stringify({
          provider_id,
          phone_number: phone,
          amount,
        }),
      }
    )

    const data = await res.json()

    console.log("CheapData Airtime:", data)

    if (data?.status === "true") {
      return {
        status: "success",
        provider: "cheapdata",
        reference: data.reference,
        message: data.message,
      }
    }

    return {
      status: "failed",
      message: data?.message,
    }

  } catch (error) {
    console.error("CheapData Airtime Error:", error)
    return { status: "failed", message: "Request failed" }
  }
}


export async function cheapData(
  phone: string,
  bundle_id: number
) {
  try {
    const res = await fetch(
      "https://www.cheapdatahub.ng/api/v1/resellers/data/purchase/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHEAPDATA_API_KEY}`,
        },
        body: JSON.stringify({
          bundle_id,
          phone_number: phone,
        }),
      }
    )

    const data = await res.json()

    console.log("CheapData Data:", data)

    if (data?.status === "true") {
      return {
        status: "success",
        provider: "cheapdata",
        reference: data.reference,
        message: data.message,
      }
    }

    return {
      status: "failed",
      message: data?.message,
    }

  } catch (error) {
    console.error("CheapData Data Error:", error)
    return { status: "failed", message: "Request failed" }
  }
}