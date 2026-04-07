"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CablePage() {
  const router = useRouter()

  const [provider, setProvider] = useState("dstv")
  const [smartcard, setSmartcard] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/cable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          smartcard,
          amount: Number(amount),
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (data.success) {
        alert("Cable subscription successful")
        router.push("/dashboard")
      } else {
        alert(data.error || "Something went wrong")
      }
    } catch {
      setLoading(false)
      alert("Network error")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Cable TV Subscription</h1>

      <form onSubmit={handlePay} className="space-y-4">
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="dstv">DSTV</option>
          <option value="gotv">GOTV</option>
          <option value="startimes">Startimes</option>
        </select>

        <input
          placeholder="Smartcard Number"
          value={smartcard}
          onChange={(e) => setSmartcard(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />

        <button className="bg-black text-white w-full py-2" disabled={loading}>
          {loading ? "Processing..." : "Subscribe"}
        </button>
      </form>
    </div>
  )
}