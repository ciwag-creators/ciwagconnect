const API_KEY = process.env.IACAFE_API_KEY
const BASE_URL = process.env.IACAFE_BASE_URL

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
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id,
        phone,
        service_id: network, // ✅ VERY IMPORTANT
        amount,
      }),
    })

    const text = await res.text()

    console.log("IAcafe Airtime Raw Response:", text)

    try {
      const data = JSON.parse(text)

      if (data?.success === true) {
        return {
          status: "success",
          provider: "iacafe",
          data,
        }
      }

      return {
        status: "failed",
        data,
      }
    } catch {
      return {
        status: "failed",
        message: "Invalid JSON response",
        raw: text,
      }
    }
  } catch (error) {
    console.error("IAcafe Airtime Error:", error)

    return {
      status: "failed",
      message: "IAcafe request failed",
    }
  }
}