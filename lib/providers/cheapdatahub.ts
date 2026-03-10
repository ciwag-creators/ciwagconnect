export async function buyCheapDataHubData(network:string, phone:string, plan:string){

  const res = await fetch("https://cheapdatahubapi.com/api/data",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":Bearer ${process.env.CHEAPDATAHUB_API_KEY}
    },
    body:JSON.stringify({
      network,
      mobile_number:phone,
      plan
    })
  })

  const data = await res.json()

  return data
}


export async function buyCheapDataHubAirtime(network:string, phone:string, amount:number){

  const res = await fetch("https://cheapdatahubapi.com/api/airtime",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":Bearer ${process.env.CHEAPDATAHUB_API_KEY}
    },
    body:JSON.stringify({
      network,
      mobile_number:phone,
      amount
    })
  })

  const data = await res.json()

  return data
}