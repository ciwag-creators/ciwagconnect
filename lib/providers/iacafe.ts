export async function buyAirtime(
  phone: string,
  amount: number,
  network: string
) {
  try {
    const res = await fetch(
      `${process.env.IACAFE_BASE_URL}/airtime`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.IACAFE_API_KEY}`,
        },
        body: JSON.stringify({
          request_id: `air_${network}_${Date.now()}`,
          phone,
          service_id: network.toLowerCase(),
          amount,
        }),
      }
    )

    const text = await res.text()
    console.log("IAcafe Airtime Raw:", text)

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return { status: "failed", raw: text }
    }

    if (data?.status === "success" || data?.success === true) {
      return {
        status: "success",
        provider: "iacafe",
        data,
      }
    }

    return {
      status: "failed",
      message: data?.message || "IAcafe failed",
      data,
    }

  } catch (error) {
    console.error("IAcafe Error:", error)
    return { status: "failed" }
  }
}