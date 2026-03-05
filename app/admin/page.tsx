"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {

const [transactions,setTransactions] = useState([]);
const [users,setUsers] = useState([]);

useEffect(()=>{

fetch("/api/admin/transactions")
.then(res=>res.json())
.then(data=>setTransactions(data.transactions || []));

fetch("/api/admin/users")
.then(res=>res.json())
.then(data=>setUsers(data.users || []));

},[]);


return (

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>


<h2 className="font-bold mb-2">Users</h2>

{users.map((u:any)=>(
<div key={u.id} className="border p-2 mb-2 flex justify-between">

<span>{u.email}</span>

<span>₦{u.balance}</span>

</div>
))}


<h2 className="font-bold mt-6 mb-2">Transactions</h2>

{transactions.map((tx:any)=>(
<div key={tx.id} className="border p-2 mb-2 flex justify-between">

<span>{tx.type}</span>

<span>₦{tx.amount}</span>

<span>{tx.status}</span>

</div>
))}

</div>

)

}