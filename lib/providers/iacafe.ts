export async function buyAirtime(
  phone: string,
  amount: number,
  network: string
) {
  const res = await fetch(
    `${process.env.IACAFE_BASE_URL}/airtime`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.IACAFE_API_KEY}`,
      },
      body: JSON.stringify({
        phone,
        amount,
        network,
      }),
    }
  )

  return await res.json()
}