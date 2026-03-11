"use client"

import { useState } from "react"

export default function FundWallet(){

const [amount,setAmount] = useState("")
const [email,setEmail] = useState("")

async function handlePayment(){

const res = await fetch("/api/fund-wallet",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
amount:Number(amount)
})

})

const data = await res.json()

if(data.data.authorization_url){

window.location.href = data.data.authorization_url

}

}

return(

<div className="card">

<h1>Fund Wallet</h1>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
placeholder="Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<button onClick={handlePayment}>
Proceed to Payment
</button>

</div>

)

}