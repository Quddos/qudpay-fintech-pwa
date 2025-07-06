import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

function getUserIdFromRequest(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""
  const match = cookieHeader.match(/auth-token=([^;]+)/)
  if (!match) return null
  try {
    const payload = jwt.verify(match[1], JWT_SECRET)
    // @ts-ignore
    return payload.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  // TODO: Replace with real balance lookup
  return NextResponse.json({ balance: 0 })
} 