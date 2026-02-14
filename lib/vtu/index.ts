import {
  VTUProvider,
  AirtimePayload,
  DataPayload,
  VTUResponse
} from './types'

import { CheapDataHubProvider } from './cheapdatahub'

/**
 * Resolve active VTU provider
 */
export function getActiveProvider(): VTUProvider {
  return new CheapDataHubProvider()
}

/**
 * Airtime purchase
 */
export async function purchaseAirtime(
  payload: AirtimePayload
): Promise<VTUResponse> {
  const provider = getActiveProvider()
  return provider.purchaseAirtime(payload)
}

/**
 * Data purchase (NO amount here)
 */
export async function purchaseData(
  payload: DataPayload
): Promise<VTUResponse> {
  const provider = getActiveProvider()
  return provider.purchaseData(payload)
}

/**
 * Default export (used by API routes)
 */
const vtuProvider = {
  purchaseAirtime,
  purchaseData
}

export default vtuProvider