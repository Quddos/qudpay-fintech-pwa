import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const requests = await sql`
      SELECT k.*, u.full_name, u.nationality
      FROM kyc_details k
      LEFT JOIN users u ON k.user_id = u.id
      ORDER BY k.created_at DESC
    `
    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error fetching KYC requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user_id, status } = await request.json()
    if (!user_id || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    await sql`
      UPDATE kyc_details SET status = ${status} WHERE user_id = ${user_id}
    `
    await sql`
      UPDATE users SET kyc_status = ${status} WHERE id = ${user_id}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("KYC status update error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
} 