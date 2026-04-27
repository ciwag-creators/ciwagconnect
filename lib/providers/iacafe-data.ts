const BASE_URL = "https://iacafe.com.ng/devapi/v1"

export async function buyData(
  phone: string,
  bundle_id: number,
  network: string
) {
  try {
    const request_id = `data_${network}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`

    const res = await fetch(`${BASE_URL}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.IACAFE_API_KEY}`,
      },
      body: JSON.stringify({
        request_id,
        phone,
        service_id: network.toLowerCase(),
        variation_id: String(bundle_id),
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
    console.error("Iacafe Data error:", error)

    return { status: "failed", message: "Request failed" }
  }
}