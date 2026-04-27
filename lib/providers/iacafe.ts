const BASE_URL = "https://iacafe.com.ng/devapi/v1"

export async function buyAirtime(
  phone: string,
  network: string,
  amount: number
) {
  try {
    const request_id = `air_${network}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`

    const res = await fetch(`${BASE_URL}/airtime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.IACAFE_API_KEY}`,
      },
      body: JSON.stringify({
        request_id,
        phone,
        service_id: network.toLowerCase(),
        amount,
      }),
    })

    const data = await res.json()

    if (data?.status === "success" || data?.status === true) {
      return {
        status: "success",
        reference: data.request_id,
        message: data.message,
      }
    }

    return { status: "failed", message: data?.message }

  } catch (error) {
    console.error("Iacafe Airtime error:", error)

    return { status: "failed", message: "Request failed" }
  }
}