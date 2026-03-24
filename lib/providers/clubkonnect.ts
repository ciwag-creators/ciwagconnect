export async function clubAirtime(
  phone: string,
  amount: number,
  network: string
) {
  const res = await fetch(${process.env.CLUB_BASE_URL}/airtime, {
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
  })

  return await res.json()
}

// Data purchase function (new)
export async function clubData(
  phone: string,
  plan: string, // e.g., '1GB', '5GB'
  network: string
) {
  const res = await fetch(${process.env.CLUB_BASE_URL}/data, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: process.env.CLUB_USER,
      key: process.env.CLUB_KEY,
      phone,
      plan,
      network,
    }),
  })

  return await res.json()
}