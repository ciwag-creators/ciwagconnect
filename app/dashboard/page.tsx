"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboard.css";

export default function Dashboard() {

  const [balance, setBalance] = useState(0);

  useEffect(() => {

    fetch("/api/wallet")

      .then(res => res.json())

      .then(data => {
        setBalance(data.balance);
      })

      .catch(() => {
        setBalance(0);
      });

  }, []);

  return (

    <div className="dashboard">

      <h1>Welcome, User</h1>

      <p className="subtitle">
        Manage your VTU services
      </p>


      <div className="wallet-card">

        <h2>Wallet Balance</h2>

        <p className="balance">
          ₦{balance.toLocaleString()}
        </p>

      </div>


      <div className="actions">

        <Link href="/dashboard/buy-airtime" className="btn">
          Buy Airtime
        </Link>

        <Link href="/dashboard/buy-data" className="btn">
          Buy Data
        </Link>

        <Link href="/dashboard/buy-electricity" className="btn">
          Buy Electricity
        </Link>

        <Link href="/dashboard/fund-wallet" className="btn fund">
          Fund Wallet
        </Link>

      </div>


      <div className="transactions">

        <h3>Recent Transactions</h3>

        <p>No transactions yet</p>

      </div>


    </div>

  );

}