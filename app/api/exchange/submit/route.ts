import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const exchangeData = await request.json()

    // Create transaction record without user authentication
    const transactions = await sql`
      INSERT INTO transactions (
        amount_sent, amount_received, sender_receipt_url,
        sender_account_details, platform_fee, status
      ) VALUES (
        ${exchangeData.amount}, ${exchangeData.exchangeResult.netAmount},
        ${exchangeData.receiptUrl}, ${JSON.stringify({
          receiveMethod: exchangeData.receiveMethod,
          upiId: exchangeData.upiId,
          bankName: exchangeData.bankName,
          accountNumber: exchangeData.accountNumber,
          ifscCode: exchangeData.ifscCode,
          receiverWhatsapp: exchangeData.receiverWhatsapp,
          displayName: exchangeData.displayName,
        })}, ${exchangeData.exchangeResult.platformFee}, 'pending'
      ) RETURNING id
    `

    return NextResponse.json({
      success: true,
      transactionId: transactions[0].id,
    })
  } catch (error) {
    console.error("Exchange submission error:", error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
