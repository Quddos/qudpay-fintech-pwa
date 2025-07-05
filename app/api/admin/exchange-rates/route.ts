import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET: List all exchange rates
export async function GET() {
  try {
    const rates = await sql`SELECT * FROM exchange_rates ORDER BY created_at DESC`
    return NextResponse.json(rates)
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 })
  }
}

// POST: Add or update an exchange rate
export async function POST(request: NextRequest) {
  try {
    const { from, to, rate } = await request.json()
    if (!from || !to || rate === undefined || rate === null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const parsedRate = parseFloat(rate)
    if (isNaN(parsedRate)) {
      return NextResponse.json({ error: "Rate must be a valid number" }, { status: 400 })
    }
    // Upsert: Try to update, if not exists then insert
    const updated = await sql`
      UPDATE exchange_rates SET rate = ${parsedRate}, created_at = NOW()
      WHERE from_currency = ${from} AND to_currency = ${to}
      RETURNING *
    `
    if (updated.length > 0) {
      return NextResponse.json(updated[0])
    }
    // If not updated, insert new
    const inserted = await sql`
      INSERT INTO exchange_rates (from_currency, to_currency, rate)
      VALUES (${from}, ${to}, ${parsedRate})
      RETURNING *
    `
    return NextResponse.json(inserted[0])
  } catch (error) {
    console.error("Error upserting exchange rate:", error)
    return NextResponse.json({ error: "Failed to upsert rate" }, { status: 500 })
  }
} 