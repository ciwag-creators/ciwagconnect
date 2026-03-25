export async function buyData(
  phone: string,
  plan: string,
  amount: number,
  network: string
) {
  try {
    const url = `${process.env.IACAFE_BASE_URL}/data`

    const res = await fetch(url, {
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
    })

    const text = await res.text()

    console.log("IAcafe Data Raw Response:", text)

    try {
      const data = JSON.parse(text)

      // handle both possible formats
      if (
        data?.status === "success" ||
        data?.success === true
      ) {
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