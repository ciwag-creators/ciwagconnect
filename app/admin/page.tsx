"use client"

import { useEffect, useState } from "react"

export default function AdminDashboard(){

  const [stats,setStats] = useState({
    users:0,
    transactions:0,
    profit:0
  })

  useEffect(()=>{

    fetch("/api/admin/stats")
    .then(res=>res.json())
    .then(data=>{
      setStats(data)
    })

  },[])

  return(

    <div style={{padding:"40px"}}>

      <h1>Admin Dashboard</h1>

      <div style={{display:"flex",gap:"20px",marginTop:"20px"}}>

        <div style={{border:"1px solid #ddd",padding:"20px"}}>
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>

        <div style={{border:"1px solid #ddd",padding:"20px"}}>
          <h3>Total Transactions</h3>
          <p>{stats.transactions}</p>
        </div>

        <div style={{border:"1px solid #ddd",padding:"20px"}}>
          <h3>Total Profit</h3>
          <p>₦{stats.profit}</p>
        </div>

      </div>

    </div>

  )
}