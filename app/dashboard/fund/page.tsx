"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FundWalletPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/fund-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: Number(amount) }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Fund Wallet</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <br /><br />

        <button disabled={loading}>
          {loading ? "Processing..." : "Fund Wallet"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}