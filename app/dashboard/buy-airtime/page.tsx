"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BuyAirtimePage() {
  const router = useRouter()

  const [phone, setPhone] = useState("")
  const [network, setNetwork] = useState("MTN")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/buy-airtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          network,
          amount: Number(amount),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      setMessage("Airtime purchase successful ✅")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch {
      setMessage("Network error")
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Buy Airtime</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <br />
        <br />

        <select value={network} onChange={(e) => setNetwork(e.target.value)}>
          <option value="MTN">MTN</option>
          <option value="Airtel">Airtel</option>
          <option value="Glo">Glo</option>
          <option value="9mobile">9mobile</option>
        </select>

        <br />
        <br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: loading ? "#999" : "#000",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Buy Airtime"}
        </button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  )
}