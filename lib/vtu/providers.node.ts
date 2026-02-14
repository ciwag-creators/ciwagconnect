import { VTUProvider } from './types'

export async function getActiveProvider(): Promise<VTUProvider> {
  return {
    async purchaseAirtime(payload) {
      return {
        success: true,
        message: 'Mock airtime purchase successful',
        reference: 'MOCK_REF_001'
      }
    },

    async purchaseData(payload) {
      return {
        success: true,
        message: 'Mock data purchase successful',
        reference: 'MOCK_REF_002'
      }
    }
  }
}