import { buyCheapDataHubAirtime, buyCheapDataHubData } from "./cheapdatahub"
import { clubKonnectAirtime } from "./clubkonnect"
import { buyElectricity as buyElectricityVtpass, buyCable as buyCableVtpass } from "./vtpass"

export async function buyAirtime(network:string, phone:string, amount:number): Promise<any>{

  try{

    const primary = await buyCheapDataHubAirtime(network,phone,amount)

    if(primary && typeof primary === 'object' && primary.status === "success"){
      return primary
    }

    throw new Error("Primary failed")

  }catch{

    return await clubKonnectAirtime(network,phone,amount)

  }

}

export async function buyData(network:string, phone:string, plan:string): Promise<any>{

  try{

    const primary = await buyCheapDataHubData(network,phone,plan)

    if(primary && typeof primary === 'object' && primary.status === "success"){
      return primary
    }

    const fallback = await clubKonnectAirtime(network,phone,plan)
    return fallback

  }catch(error){

    const fallback = await clubKonnectAirtime(network,phone,plan)
    return fallback

  }

}

export async function buyElectricity(disco:string, meter:string, amount:number){

  return await buyElectricityVtpass(disco,meter,amount)

}

export async function buyCable(provider:string, smartcard:string, amount:number){

  return await buyCableVtpass(provider,smartcard,amount)

}