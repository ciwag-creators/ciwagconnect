export async function getActiveProvider() {
  return {
    name: 'mock-provider',

    buyData: async (_payload: any) => {
      return {
        success: true,
        token: '1234-5678-9012',
        units: '50kWh',
      }
    },
  }
}