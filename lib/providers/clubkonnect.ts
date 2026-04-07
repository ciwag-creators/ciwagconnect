// lib/providers/clubkonnect.ts

const BASE_URL = process.env.CLUB_BASE_URL
const USER = process.env.CLUB_USER
const API_KEY = process.env.CLUB_KEY

// =============================
// Airtime
// =============================
export async function buyAirtime(
  phone: string,
  network: string,
  amount: number
) {
  try {
    if (!BASE_URL || !USER || !API_KEY) {
      console.error("ClubKonnect environment missing")

      return {
        status: "failed",
        message: "ClubKonnect environment variables missing",
      }
    }

    const url = `${BASE_URL}/topup`

    console.log("ClubKonnect Airtime URL:", url)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: USER,
        APIKey: API_KEY,
        MobileNetwork: network,
        Amount: amount,
        MobileNumber: phone,
      }),
    })

    const text = await res.text()

    console.log("ClubKonnect Airtime Raw Response:", text)

    let data

    try {
      data = JSON.parse(text)
    } catch {
      return {
        status: "failed",
        message: "Invalid ClubKonnect response",
        raw: text,
      }
    }

    if (
      data?.Status === "successful" ||
      data?.Status === "success" ||
      data?.code === "200"
    ) {
      return {
        status: "success",
        provider: "clubkonnect",
        data,
      }
    }

    return {
      status: "failed",
      message: data?.Message || "ClubKonnect airtime failed",
      data,
    }

  } catch (error) {
    console.error("ClubKonnect Airtime Error:", error)

    return {
      status: "failed",
      message: "ClubKonnect airtime failed",
    }
  }
}


// =============================
// Data
// =============================
export async function buyData(
  phone: string,
  plan: string,
  amount: number,
  network: string
) {
  try {
    if (!BASE_URL || !USER || !API_KEY) {
      return {
        status: "failed",
        message: "ClubKonnect environment missing",
      }
    }

    const url = `${BASE_URL}/data`

    console.log("ClubKonnect Data URL:", url)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: USER,
        APIKey: API_KEY,
        MobileNetwork: network,
        DataPlan: plan,
        Amount: amount,
        MobileNumber: phone,
      }),
    })

    const text = await res.text()

    console.log("ClubKonnect Data Raw Response:", text)

    let data

    try {
      data = JSON.parse(text)
    } catch {
      return {
        status: "failed",
        message: "Invalid ClubKonnect data response",
        raw: text,
      }
    }

    if (
      data?.Status === "successful" ||
      data?.Status === "success" ||
      data?.code === "200"
    ) {
      return {
        status: "success",
        provider: "clubkonnect",
        data,
      }
    }

    return {
      status: "failed",
      message: data?.Message || "ClubKonnect data failed",
      data,
    }

  } catch (error) {
    console.error("ClubKonnect Data Error:", error)

    return {
      status: "failed",
      message: "ClubKonnect data failed",
    }
  }
}