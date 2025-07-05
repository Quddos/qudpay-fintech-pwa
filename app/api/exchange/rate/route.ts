import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get the latest INR->NGN rate
    const inrToNgn = await sql`
      SELECT * FROM exchange_rates WHERE from_currency = 'INR' AND to_currency = 'NGN' ORDER BY created_at DESC LIMIT 1
    `
    // Get the latest NGN->INR rate
    const ngnToInr = await sql`
      SELECT * FROM exchange_rates WHERE from_currency = 'NGN' AND to_currency = 'INR' ORDER BY created_at DESC LIMIT 1
    `
    if (!inrToNgn[0] && !ngnToInr[0]) {
      return NextResponse.json({ error: "No rates found" }, { status: 404 })
    }
    return NextResponse.json({
      inrToNgn: inrToNgn[0] || null,
      ngnToInr: ngnToInr[0] || null,
    })
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 })
  }
} 