// ./lib/providers/clubkonnect.ts

// =============================
// Airtime Purchase
// =============================
export async function clubAirtime(
  phone: string,
  amount: number,
  network: string
) {
  try {

    const url = `${process.env.CLUB_BASE_URL}/airtime`

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: process.env.CLUB_USER,
        key: process.env.CLUB_KEY,
        phone,
        network,
        amount,
      }),
    })

    const text = await res.text()

    console.log("ClubKonnect Airtime Raw Response:", text)

    try {
      return JSON.parse(text)
    } catch {
      return {
        status: "failed",
        message: "Invalid ClubKonnect response",
        raw: text,
      }
    }

  } catch (error) {

    console.error("ClubKonnect Airtime Error:", error)

    return {
      status: "failed",
      message: "ClubKonnect airtime failed",
    }
  }
}



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
        user: process.env.CLUB_USER,
        key: process.env.CLUB_KEY,
        phone,
        network,
        plan,
        amount,
      }),
    })

    const text = await res.text()

    console.log("ClubKonnect Data Raw Response:", text)

    try {
      return JSON.parse(text)
    } catch {
      return {
        status: "failed",
        message: "Invalid ClubKonnect data response",
        raw: text,
      }
    }

  } catch (error) {

    console.error("ClubKonnect Data Error:", error)

    return {
      status: "failed",
      message: "ClubKonnect data failed",
    }
  }
}