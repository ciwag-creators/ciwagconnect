"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboard.css";

export default function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("/api/wallet")

      .then((res) => res.json())

      .then((data) => {

        setBalance(data.balance || 0);

        setLoading(false);

      })

      .catch(() => setLoading(false));

  }, []);


  return (

    <div className="dashboard">

      {/* Sidebar */}

      <div className="sidebar">

        <h2>CIWAG VTU</h2>

        <Link href="/dashboard">Dashboard</Link>

        <Link href="/dashboard/airtime">Buy Airtime</Link>

        <Link href="/dashboard/data">Buy Data</Link>

        <Link href="/dashboard/electricity">Electricity</Link>

        <Link href="/dashboard/fund">Fund Wallet</Link>

      </div>


      {/* Main */}

      <div className="main">

        <h1>Dashboard</h1>


        {/* Wallet Card */}

        <div className="card">

          <h3>Wallet Balance</h3>

          <p>

            {loading

              ? "Loading..."

              : "₦" + balance.toLocaleString()}

          </p>

        </div>


        {/* Services */}

        <div className="services">

          <Link href="/dashboard/airtime" className="service">

            Buy Airtime

          </Link>


          <Link href="/dashboard/data" className="service">

            Buy Data

          </Link>


          <Link href="/dashboard/electricity" className="service">

            Pay Electricity

          </Link>


          <Link href="/dashboard/fund" className="service">

            Fund Wallet

          </Link>

        </div>

      </div>

    </div>

  );

}