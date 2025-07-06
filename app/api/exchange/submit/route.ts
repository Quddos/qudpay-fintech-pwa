import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"
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

export async function POST(request: NextRequest) {
  try {
    const exchangeData = await request.json()
    const userId = getUserIdFromRequest(request)

    // Save all details to exchange_requests
    const inserted = await sql`
      INSERT INTO exchange_requests (
        user_id, receive_method, upi_id, receiver_whatsapp, display_name, bank_name, account_number, ifsc_code, email, amount, receipt_url
      ) VALUES (
        ${userId},
        ${exchangeData.receiveMethod},
        ${exchangeData.upiId},
        ${exchangeData.receiverWhatsapp},
        ${exchangeData.displayName},
        ${exchangeData.bankName},
        ${exchangeData.accountNumber},
        ${exchangeData.ifscCode},
        ${exchangeData.email},
        ${exchangeData.amount},
        ${exchangeData.receiptUrl}
      ) RETURNING id
    `

    return NextResponse.json({
      success: true,
      requestId: inserted[0].id,
    })
  } catch (error) {
    console.error("Exchange submission error:", error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
