export async function buyElectricity(meter:string, disco:string, amount:number){

  const res = await fetch("https://api.vtpass.com/api/pay",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "api-key":process.env.VTPASS_API_KEY!,
      "secret-key":process.env.VTPASS_SECRET!
    },
    body:JSON.stringify({
      serviceID:disco,
      billersCode:meter,
      amount
    })
  })

  const data = await res.json()

  return data
}



export async function buyCable(smartcard:string, provider:string, amount:number){

  const res = await fetch("https://api.vtpass.com/api/pay",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "api-key":process.env.VTPASS_API_KEY!,
      "secret-key":process.env.VTPASS_SECRET!
    },
    body:JSON.stringify({
      serviceID:provider,
      billersCode:smartcard,
      amount
    })
  })

  const data = await res.json()

  return data
}