"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/wallet")
      .then(res => res.json())
      .then(data => setBalance(data.balance || 0));

    fetch("/api/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []));
  }, []);

  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          {greeting} 👋
        </h1>

        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-xl mb-8">
          <p className="text-sm opacity-80">Available Balance</p>
          <h2 className="text-4xl font-bold mt-2">
            ₦{balance.toLocaleString()}
          </h2>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <Link href="/dashboard/fund-wallet">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center">
              <p className="text-lg font-semibold">Fund Wallet</p>
            </div>
          </Link>

          <Link href="/dashboard/buy-airtime">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center">
              <p className="text-lg font-semibold">Buy Airtime</p>
            </div>
          </Link>
        </div>

        {/* Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Recent Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <p className="capitalize font-medium">
                    {tx.type}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>

                <p
                  className={
                    tx.type === "funding"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  ₦{tx.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}