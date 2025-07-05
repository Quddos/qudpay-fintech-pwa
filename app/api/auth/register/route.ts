import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, phone } = await request.json()

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUsers = await sql`
      INSERT INTO users (email, full_name, phone)
      VALUES (${email}, ${fullName}, ${phone})
      RETURNING id, email, full_name, is_admin, kyc_status
    `

    const user = newUsers[0]

    return NextResponse.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_admin: user.is_admin,
      kyc_status: user.kyc_status,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
