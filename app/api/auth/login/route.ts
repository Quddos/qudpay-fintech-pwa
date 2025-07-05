import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = "your-jwt-secret-key-here"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple authentication - in production, use proper password hashing
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, isAdmin: user.is_admin }, JWT_SECRET, {
      expiresIn: "7d",
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_admin: user.is_admin,
      kyc_status: user.kyc_status,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
