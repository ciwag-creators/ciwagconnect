"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function BecomeAgent(){

  const router = useRouter()
  const [loading,setLoading] = useState(false)

  async function upgrade(){

    setLoading(true)

    const res = await fetch("/api/become-agent",{
      method:"POST"
    })

    const data = await res.json()

    setLoading(false)

    if(data.success){
      alert("You are now an agent")
      router.push("/dashboard")
    }else{
      alert(data.error)
    }

  }

  return(

    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Become an Agent
      </h1>

      <p className="mb-6">
        Agents get cheaper prices and can resell services.
      </p>

      <button
      onClick={upgrade}
      className="bg-black text-white px-4 py-2"
      disabled={loading}
      >
        {loading ? "Processing..." : "Upgrade to Agent"}
      </button>

    </div>

  )
}