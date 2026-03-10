export async function clubKonnectAirtime(network:string, phone:string, amount:number){

  const url = https://www.nellobytesystems.com/APIAirtimeV1.asp?UserID=${process.env.CLUB_USER}&APIKey=${process.env.CLUB_KEY}&MobileNetwork=${network}&Amount=${amount}&MobileNumber=${phone}

  const res = await fetch(url)

  const data = await res.json()

  return data
}