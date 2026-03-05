"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {

    async function loadData() {

      const walletRes = await fetch("/api/fund-wallet");
      const walletData = await walletRes.json();
      setWallet(walletData.balance || 0);

      const txRes = await fetch("/api/transactions");
      const txData = await txRes.json();
      setTransactions(txData.transactions || []);
    }

    loadData();

  }, []);

  return (

    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Wallet Card */}

      <div className="bg-blue-600 text-white p-6 rounded-xl mb-6">
        <p className="text-sm">Wallet Balance</p>
        <h2 className="text-3xl font-bold">₦{wallet}</h2>

        <Link href="/dashboard/fund">
          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded">
            Fund Wallet
          </button>
        </Link>
      </div>


      {/* Quick Actions */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <Link href="/dashboard/buy-airtime">
          <div className="bg-white shadow rounded-lg p-4 text-center hover:bg-gray-50">
            📞
            <p className="font-semibold">Buy Airtime</p>
          </div>
        </Link>

        <Link href="/dashboard/buy-data">
          <div className="bg-white shadow rounded-lg p-4 text-center hover:bg-gray-50">
            🌐
            <p className="font-semibold">Buy Data</p>
          </div>
        </Link>

        <Link href="/dashboard/electricity">
          <div className="bg-white shadow rounded-lg p-4 text-center hover:bg-gray-50">
            ⚡
            <p className="font-semibold">Electricity</p>
          </div>
        </Link>

        <Link href="/dashboard/cable">
          <div className="bg-white shadow rounded-lg p-4 text-center hover:bg-gray-50">
            📺
            <p className="font-semibold">Cable TV</p>
          </div>
        </Link>

      </div>


      {/* Transactions */}

      <div className="bg-white shadow rounded-lg p-6">

        <h2 className="font-bold mb-4">Recent Transactions</h2>

        {transactions.length === 0 ? (

          <p className="text-gray-500">No transactions yet</p>

        ) : (

          transactions.map((tx: any) => (

            <div
              key={tx.id}
              className="flex justify-between border-b py-3"
            >

              <div>
                <p className="font-medium capitalize">{tx.type}</p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.created_at).toLocaleString()}
                </p>
              </div>

              <p className="font-bold">
                ₦{tx.amount}
              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

}