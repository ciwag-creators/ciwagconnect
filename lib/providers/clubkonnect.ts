export async function clubData(
  phone: string,
  bundle_id: number,
  network: string
) {
  try {
    const request_id = `ck_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`

    const baseUrl =
      "https://www.nellobytesystems.com/APIDatabundleV1.asp"

    const url = `${baseUrl}?UserID=${process.env.CLUB_USER_ID}&APIKey=${process.env.CLUB_API_KEY}&MobileNetwork=${network.toUpperCase()}&DataPlan=${bundle_id}&MobileNumber=${phone}&RequestID=${request_id}`

    const res = await fetch(url, {
      method: "GET",
    })

    const data = await res.json()

    console.log("Clubkonnect Data:", data)

    // ✅ NORMALIZE RESPONSE
    if (
      data?.status === "ORDER_RECEIVED" ||
      data?.status === "SUCCESS"
    ) {
      return {
        status: "success",
        reference: request_id,
        message: "Success",
      }
    }

    return {
      status: "failed",
      message: data?.status || "Clubkonnect failed",
    }

  } catch (error) {
    console.error("Clubkonnect error:", error)

    return {
      status: "failed",
      message: "Clubkonnect request failed",
    }
  }
}