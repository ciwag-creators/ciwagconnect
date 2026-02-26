"use client"

import { useState } from "react"
import "./buy-airtime.css"

export default function BuyAirtime() {

  const [network, setNetwork] = useState("MTN")
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handlePurchase() {

    setLoading(true)
    setMessage("")

    try {

      const res = await fetch("/api/vtu/airtime", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          user_id: "test-user",

          network,

          phone,

          amount: Number(amount),

          reference: Date.now().toString(),

        }),

      })

      const data = await res.json()

      if (data.success) {

        setMessage("✅ Airtime purchase successful")

        setPhone("")
        setAmount("")

      } else {

        setMessage("❌ " + data.error)

      }

    } catch {

      setMessage("❌ Network error")

    }

    setLoading(false)

  }

  return (

    <main className="container">

      <h1>Buy Airtime</h1>

      <div className="card">

        <label>Network</label>

        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >

          <option value="MTN">MTN</option>

          <option value="AIRTEL">Airtel</option>

          <option value="GLO">Glo</option>

          <option value="9MOBILE">9Mobile</option>

        </select>


        <label>Phone Number</label>

        <input

          type="text"

          placeholder="08012345678"

          value={phone}

          onChange={(e) => setPhone(e.target.value)}

        />


        <label>Amount</label>

        <input

          type="number"

          placeholder="100"

          value={amount}

          onChange={(e) => setAmount(e.target.value)}

        />


        <button

          onClick={handlePurchase}

          disabled={loading}

        >

          {loading ? "Processing..." : "Buy Airtime"}

        </button>


        {message && (

          <p className="message">

            {message}

          </p>

        )}

      </div>

    </main>

  )

}