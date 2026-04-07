// lib/vtu/types.ts

export interface AirtimePayload {
  phone: string
  network: string
  amount: number
}

export interface DataPayload {
  phone: string
  network: string
  plan: string
}

/* ========= Provider Response ========= */

export interface VTUResponse {
  success: boolean
  message?: string

  // Transaction identifiers
  reference?: string
  token?: string

  // Pricing (needed for profit calculation)
  cost_price?: number
  fee?: number
}
  
export interface VTUProvider {
  purchaseAirtime(payload: AirtimePayload): Promise<VTUResponse>
  purchaseData(payload: DataPayload): Promise<VTUResponse>
}