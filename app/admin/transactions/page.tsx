"use client"

import { useEffect,useState } from "react"

export default function Transactions(){

  const [transactions,setTransactions] = useState([])

  useEffect(()=>{

    fetch("/api/admin/transactions")
    .then(res=>res.json())
    .then(data=>{
      setTransactions(data)
    })

  },[])

  return(

    <div style={{padding:"40px"}}>

      <h2>All Transactions</h2>

      <table>

        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Profit</th>
            <th>Reference</th>
          </tr>
        </thead>

        <tbody>

        {transactions.map((t:any)=>(
          <tr key={t.id}>
            <td>{t.type}</td>
            <td>{t.amount}</td>
            <td>{t.profit}</td>
            <td>{t.reference}</td>
          </tr>
        ))}

        </tbody>

      </table>

    </div>

  )
}