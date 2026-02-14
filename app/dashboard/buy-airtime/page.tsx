'use client'

import { useState } from 'react'

export default function BuyAirtime() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    await fetch('/api/airtime', {
      method: 'POST',
      body: JSON.stringify({
        network: formData.get('network'),
        phone: formData.get('phone'),
        amount: Number(formData.get('amount'))
      })
    })

    setLoading(false)
    alert('Airtime request sent')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 bg-white p-6 rounded-xl shadow"
    >
      <h2 className="text-lg font-semibold">
        Buy Airtime
      </h2>

      <select
        name="network"
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Select Network</option>
        <option value="mtn">MTN</option>
        <option value="airtel">Airtel</option>
        <option value="glo">Glo</option>
        <option value="9mobile">9mobile</option>
      </select>

      <input
        name="phone"
        placeholder="Phone Number"
        required
        className="w-full border p-2 rounded"
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        required
        className="w-full border p-2 rounded"
      />

      <button
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? 'Processing...' : 'Buy Airtime'}
      </button>
    </form>
  )
}
