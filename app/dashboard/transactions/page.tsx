"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [walletRes, txRes] = await Promise.all([
          fetch("/api/wallet"),
          fetch("/api/transactions"),
        ]);

        const walletData = await walletRes.json();
        const txData = await txRes.json();

        if (walletRes.ok) {
          setBalance(walletData.balance);
        }

        if (txRes.ok) {
          setTransactions(txData.transactions);
        }

      } catch (error) {
        console.error("Dashboard error:", error);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      {/* Wallet Card */}
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          width: "300px",
        }}
      >
        <h3>Wallet Balance</h3>
        <h2>₦{balance}</h2>
      </div>

      <h2>Recent Transactions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Network</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.type}</td>
                <td>{tx.network}</td>
                <td>{tx.phone}</td>
                <td>₦{tx.amount}</td>
                <td>{tx.status}</td>
                <td>
                  {new Date(tx.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}