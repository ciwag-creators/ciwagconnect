import {
  VTUProvider,
  AirtimePayload,
  DataPayload,
  VTUResponse,
} from './types'

export class CheapDataHubProvider implements VTUProvider {

  async purchaseAirtime(
    payload: AirtimePayload
  ): Promise<VTUResponse> {
    return {
      success: true,
      message: 'Airtime purchase successful',
    }
  }

  async purchaseData(
    payload: DataPayload
  ): Promise<VTUResponse> {
    return {
      success: true,
      message: 'Data purchase successful',
    }
  }
}