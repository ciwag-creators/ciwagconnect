// lib/providers/clubkonnect.ts

// =============================
// Airtime
// =============================
export async function clubAirtime(
  phone: string,
  amount: number,
  network: string
) {
  try {
    const url = `${process.env.CLUB_BASE_URL}/topup`

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: process.env.CLUB_USER,
        APIKey: process.env.CLUB_KEY,
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

    if (data?.Status === "successful") {
      return {
        status: "success",
        provider: "clubkonnect",
        data,
      }
    }

    return {
      status: "failed",
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
export async function clubData(
  phone: string,
  plan: string,
  amount: number,
  network: string
) {
  try {
    const url = `${process.env.CLUB_BASE_URL}/data`

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserID: process.env.CLUB_USER,
        APIKey: process.env.CLUB_KEY,
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

    if (data?.Status === "successful") {
      return {
        status: "success",
        provider: "clubkonnect",
        data,
      }
    }

    return {
      status: "failed",
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