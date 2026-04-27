const BASE_URL = "https://www.nellobytesystems.com"

export async function clubData(
  phone: string,
  bundle_id: number,
  network: string
) {
  try {
    const request_id = `ck_data_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`

    const url = `${BASE_URL}/APIDatabundleV1.asp?UserID=${process.env.CLUB_USER_ID}&APIKey=${process.env.CLUB_API_KEY}&MobileNetwork=${network.toUpperCase()}&DataPlan=${bundle_id}&MobileNumber=${phone}&RequestID=${request_id}`

    const res = await fetch(url)

    const text = await res.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.log("Non-JSON response:", text)
      return { status: "failed", message: "Invalid response" }
    }

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
      message: data?.status || "Failed",
    }

  } catch (error) {
    console.error("Club Data error:", error)

    return {
      status: "failed",
      message: "Request failed",
    }
  }
}


export async function clubAirtime(
  phone: string,
  network: string,
  amount: number
) {
  try {
    const request_id = `ck_air_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`

    const url = `${BASE_URL}/APIAirtimeV1.asp?UserID=${process.env.CLUB_USER_ID}&APIKey=${process.env.CLUB_API_KEY}&MobileNetwork=${network.toUpperCase()}&Amount=${amount}&MobileNumber=${phone}&RequestID=${request_id}`

    const res = await fetch(url)

    const text = await res.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.log("Non-JSON response:", text)
      return { status: "failed", message: "Invalid response" }
    }

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
      message: data?.status || "Failed",
    }

  } catch (error) {
    console.error("Club Airtime error:", error)

    return {
      status: "failed",
      message: "Request failed",
    }
  }
}