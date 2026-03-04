"use client";

import { useState } from "react";

export default function AdminPage() {

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const fundWallet = async () => {

    const res = await fetch(
      "/api/admin/fund-wallet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {

      alert("Wallet funded");

    } else {

      alert(data.error);

    }

  };

  return (

    <div style={{
      padding: "40px"
    }}>

      <h1>Admin Fund Wallet</h1>

      <input
        placeholder="User email"
        value={email}
        onChange={(e)=>
          setEmail(e.target.value)
        }
      />

      <br/><br/>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e)=>
          setAmount(e.target.value)
        }
      />

      <br/><br/>

      <button
        onClick={fundWallet}
      >
        Fund Wallet
      </button>

    </div>

  );
}