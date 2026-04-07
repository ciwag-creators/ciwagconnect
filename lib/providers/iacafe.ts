const API_KEY = process.env.IACAFE_API_KEY
const BASE_URL = process.env.IACAFE_BASE_URL

export async function buyAirtime(
  phone: string,
  network: string,
  amount: number
) {
  try {
    if (!API_KEY || !BASE_URL) {
      console.error("IAcafe env missing")

      return {
        status: "failed",
        message: "IAcafe environment variables missing",
      }
    }

    const url = `${BASE_URL}/airtime`

    console.log("IAcafe URL:", url)
    console.log("API KEY:", API_KEY)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        network,
        amount,
      }),
    })

    const text = await res.text()

    console.log("IAcafe Airtime Raw Response:", text)

    try {
      const data = JSON.parse(text)

      if (
        data.status === "success" ||
        data.status === "successful" ||
        data.code === "200"
      ) {
        return {
          status: "success",
          data,
        }
      }

      return {
        status: "failed",
        message: data.message || "IAcafe failed",
        data,
      }
    } catch {
      return {
        status: "failed",
        message: "Invalid JSON response",
        raw: text,
      }
    }
  } catch (error) {
    console.error("IAcafe Airtime Error:", error)

    return {
      status: "failed",
      message: "IAcafe airtime failed",
    }
  }
}