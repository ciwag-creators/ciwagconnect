// ./providers/clubkonnect.ts

// Airtime purchase function
export async function clubAirtime(
  phone: string,
  amount: number,
  network: string
) {
  try {
    const res = await fetch(
      `${process.env.CLUB_BASE_URL}/airtime`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: process.env.CLUB_USER,
          key: process.env.CLUB_KEY,
          phone,
          amount,
          network,
        }),
      }
    )

    const data = await res.json()

    if (data?.status === "success") {
      return {
        status: "success",
        data,
      }
    }

    return { status: "failed" }

  } catch (error) {
    console.error("ClubKonnect Airtime Error:", error)

    return { status: "failed" }
  }
}


// =============================
// Data Purchase
// =============================
export async function clubData(
  phone: string,
  plan: string,
  amount: number,
  network: string
) {
  try {
    const res = await fetch(
      `${process.env.CLUB_BASE_URL}/data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: process.env.CLUB_USER,
          key: process.env.CLUB_KEY,
          phone,
          plan,
          amount,
          network,
        }),
      }
    )

    const data = await res.json()

    if (data?.status === "success") {
      return {
        status: "success",
        data,
      }
    }

    return { status: "failed" }

  } catch (error) {
    console.error("ClubKonnect Data Error:", error)

    return { status: "failed" }
  }
}