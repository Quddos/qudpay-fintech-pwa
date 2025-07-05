import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Get current Naira account details
    const accounts = await sql`
      SELECT * FROM account_balances WHERE currency = 'NGN' LIMIT 1
    `

    if (accounts.length === 0) {
      return NextResponse.json({ error: "Account details not found" }, { status: 404 })
    }

    const account = accounts[0]
    const accountDetails = {
      bankName: account.bank_name,
      accountName: account.account_name,
      accountNumber: account.account_number,
    }

    // Send email with actual account details
    await sendEmail({
      to: email,
      subject: 'Your Naira Account Details',
      html: `<p>Here are the Naira account details for your payment:</p>
        <ul>
          <li><b>Account Name:</b> ${accountDetails.accountName}</li>
          <li><b>Account Number:</b> ${accountDetails.accountNumber}</li>
          <li><b>Bank Name:</b> ${accountDetails.bankName}</li>
        </ul>
        <p>Please make your payment and upload your receipt to complete the exchange process.</p>`
    })

    return NextResponse.json(accountDetails)
  } catch (error) {
    console.error("Account details email error:", error)
    return NextResponse.json({ error: "Failed to get account details or send email" }, { status: 500 })
  }
}
