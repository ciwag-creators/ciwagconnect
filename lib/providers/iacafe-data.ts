// lib/providers/iacafe-data.ts

export async function buyData(
  phone: string,
  plan: string,
  amount: number,
  network: string
) {
  try {

    const res = await fetch(
      `${process.env.IACAFE_BASE_URL}/data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.IACAFE_API_KEY}`,
        },
        body: JSON.stringify({
          phone,
          plan,
          amount,
          network,
        }),
      }
    )

    const text = await res.text()

    console.log("IAcafe Data Raw Response:", text)

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
        message: "Invalid IAcafe data response",
        raw: text,
      }

    }

  } catch (error) {

    console.error("IAcafe Data Error:", error)

    return {
      status: "failed",
      message: "IAcafe data provider failed",
    }
  }
}