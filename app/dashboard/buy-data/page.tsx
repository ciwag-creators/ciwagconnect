"use client";

import { useState } from "react";

export default function BuyData() {

  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("MTN");
  const [plan, setPlan] = useState("");
  const [message, setMessage] = useState("");

  async function buyData(e:any) {
    e.preventDefault();

    setMessage("Processing...");

    const res = await fetch("/api/buy-data", {
      method: "POST",
      body: JSON.stringify({
        phone,
        network,
        plan
      })
    });

    const data = await res.json();

    setMessage(data.message);
  }

  return (

    <div className="max-w-md mx-auto p-6">

      <h1 className="text-xl font-bold mb-4">Buy Data</h1>

      <form onSubmit={buyData} className="space-y-4">

        <select
          className="w-full border p-2"
          onChange={(e)=>setNetwork(e.target.value)}
        >
          <option>MTN</option>
          <option>Airtel</option>
          <option>Glo</option>
          <option>9mobile</option>
        </select>

        <select
          className="w-full border p-2"
          onChange={(e)=>setPlan(e.target.value)}
        >
          <option value="">Select Plan</option>
          <option value="500MB">500MB</option>
          <option value="1GB">1GB</option>
          <option value="2GB">2GB</option>
          <option value="5GB">5GB</option>
        </select>

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border p-2"
          onChange={(e)=>setPhone(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Buy Data
        </button>

      </form>

      {message && (
        <p className="mt-4 text-center">{message}</p>
      )}

    </div>

  );

}