"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ElectricityPage() {

  const router = useRouter()

  const [disco, setDisco] = useState("ikeja")
  const [meter, setMeter] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleBuy(e:any){
    e.preventDefault()

    setLoading(true)

    const res = await fetch("/api/electricity",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        disco,
        meter,
        amount
      })
    })

    const data = await res.json()

    setLoading(false)

    if(data.success){
      alert("Electricity purchase successful")
      router.push("/dashboard")
    }else{
      alert(data.error || "Something went wrong")
    }
  }

  return(
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Buy Electricity
      </h1>

      <form onSubmit={handleBuy} className="space-y-4">

        <select
        value={disco}
        onChange={(e)=>setDisco(e.target.value)}
        className="border p-2 w-full"
        >

          <option value="ikeja">Ikeja Electric</option>
          <option value="eko">Eko Electric</option>
          <option value="abuja">Abuja Electric</option>
          <option value="portharcourt">Port Harcourt Electric</option>

          <option value="benin">Benin Electricity (BEDC)</option>
          <option value="enugu">Enugu Electricity (EEDC)</option>
          <option value="ibadan">Ibadan Electricity (IBEDC)</option>
          <option value="aba">Aba Power</option>

        </select>

        <input
        type="text"
        placeholder="Meter Number"
        value={meter}
        onChange={(e)=>setMeter(e.target.value)}
        className="border p-2 w-full"
        />

        <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
        className="border p-2 w-full"
        />

        <button
        className="bg-black text-white px-4 py-2 w-full"
        disabled={loading}
        >
          {loading ? "Processing..." : "Buy Electricity"}
        </button>

      </form>

    </div>
  )
}