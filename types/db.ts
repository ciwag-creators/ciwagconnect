export interface Wallet {
  id: string
  user_id: string
  balance: number
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  service: 'airtime' | 'data'
  status: 'pending' | 'success' | 'failed'
  reference: string
}
