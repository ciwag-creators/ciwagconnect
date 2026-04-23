export async function buyAirtime(
  phone: string,
  amount: number,
  network: string
) {
  try {

    const res = await fetch(
      `${process.env.IACAFE_BASE_URL}/devapi/v1/airtime`,
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

    const text = await res.text()

    console.log("IAcafe Airtime Raw Response:", text)

    try {
      const data = JSON.parse(text)

      if (data?.status === "success") {
        return {
          status: "success",
          data,
          provider: "iacafe",
        }
      }

      return {
        status: "failed",
        data,
      }

    } catch {
      return {
        status: "failed",
        message: "Invalid IAcafe response",
        raw: text,
      }
    }

  } catch (error) {

    console.error("IAcafe Airtime Error:", error)

    return {
      status: "failed",
      message: "IAcafe provider failed",
    }
  }
}