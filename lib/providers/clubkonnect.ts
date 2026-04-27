export async function clubAirtime(
  phone: string,
  network: string,
  amount: number
) {
  try {
    const request_id = `ck_air_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`

    const baseUrl =
      "https://www.nellobytesystems.com/APIAirtimeV1.asp"

    const url = `${baseUrl}?UserID=${process.env.CLUB_USER_ID}&APIKey=${process.env.CLUB_API_KEY}&MobileNetwork=${network.toUpperCase()}&Amount=${amount}&MobileNumber=${phone}&RequestID=${request_id}`

    const res = await fetch(url)
    const data = await res.json()

    console.log("Clubkonnect Airtime:", data)

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
      message: data?.status || "Airtime failed",
    }

  } catch (error) {
    console.error("Clubkonnect Airtime error:", error)

    return {
      status: "failed",
      message: "Request failed",
    }
  }
}