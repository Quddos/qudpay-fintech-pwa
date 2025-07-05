import { neon } from "@neondatabase/serverless"

const sql = neon("postgresql://qudpay_owner:password123@ep-example.us-east-1.aws.neon.tech/qudpay?sslmode=require")

export { sql }

export interface User {
  id: number
  email: string
  full_name?: string
  nationality?: string
  phone?: string
  is_admin: boolean
  kyc_status: "pending" | "approved" | "rejected"
  created_at: string
}

export interface ExchangeRate {
  id: number
  from_currency: string
  to_currency: string
  rate: number
  created_at: string
}

export interface Transaction {
  id: number
  sender_id: number
  receiver_id: number
  amount_sent: number
  amount_received: number
  status: "pending" | "completed" | "cancelled"
  platform_fee: number
  created_at: string
}

export interface MarketplaceListing {
  id: number
  user_id: number
  from_currency: string
  to_currency: string
  amount: number
  exchange_rate: number
  platform_fee: number
  status: "active" | "completed" | "cancelled"
  created_at: string
}
