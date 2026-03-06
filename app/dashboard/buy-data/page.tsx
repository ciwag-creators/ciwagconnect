"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyDataPage() {

  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("MTN");
  const [plan, setPlan] = useState("500MB");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleBuy(e: React.FormEvent) {

    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        network,
        plan,
        amount: Number(amount),
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {

      setMessage("✅ Data purchase successful");

      setPhone("");
      setAmount("");

      // Return to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } else {
      setMessage("❌ " + data.error);
    }
  }

  return (

    <div style={{ padding: "40px", maxWidth: "400px" }}>

      <h2>Buy Data</h2>

      <form onSubmit={handleBuy}>

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >
          <option>MTN</option>
          <option>Airtel</option>
          <option>Glo</option>
          <option>9mobile</option>
        </select>

        <br /><br />

        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="500MB">500MB</option>
          <option value="1GB">1GB</option>
          <option value="2GB">2GB</option>
          <option value="5GB">5GB</option>
        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit" disabled={loading}>

          {loading ? "Processing..." : "Buy Data"}

        </button>

      </form>

      <br />

      <p>{message}</p>

    </div>

  );
}