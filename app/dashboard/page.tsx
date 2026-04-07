"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Dashboard() {
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    async function loadWallet() {
      try {
        const res = await fetch("/api/wallet")
        const data = await res.json()
        setBalance(Number(data.balance) || 0)
      } catch {
        setBalance(0)
      }
    }

    loadWallet()
  }, [])

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="wallet-card">
        <h3>Wallet Balance</h3>
        <h1>₦{balance}</h1>

        <Link href="/fund-wallet">
          <button className="button">Fund Wallet</button>
        </Link>
      </div>

      <div className="services-grid">
        <Link href="/dashboard/buy-airtime" className="service-card">
          <div style={{ fontSize: "30px" }}>📞</div>
          <h3>Airtime</h3>
        </Link>

        <Link href="/dashboard/buy-data" className="service-card">
          <div style={{ fontSize: "30px" }}>📶</div>
          <h3>Data</h3>
        </Link>

        <Link href="/dashboard/electricity" className="service-card">
          <div style={{ fontSize: "30px" }}>⚡️</div>
          <h3>Electricity</h3>
        </Link>

        <Link href="/dashboard/cable" className="service-card">
          <div style={{ fontSize: "30px" }}>📺</div>
          <h3>Cable</h3>
        </Link>
      </div>

      <h2 style={{ marginTop: "40px" }}>Recent Transactions</h2>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Airtime</td>
            <td>₦1000</td>
            <td className="success">Successful</td>
          </tr>

          <tr>
            <td>Electricity</td>
            <td>₦5000</td>
            <td className="warning">Pending</td>
          </tr>

          <tr>
            <td>Data</td>
            <td>₦2000</td>
            <td className="error">Failed</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}