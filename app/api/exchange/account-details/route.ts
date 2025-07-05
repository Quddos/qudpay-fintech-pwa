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

    // In a real app, you would send an email here
    // For now, we'll just return the details
    const accountDetails = {
      bankName: account.bank_name,
      accountName: account.account_name,
      accountNumber: account.account_number,
    }

    // TODO: Send email with account details
    console.log(`Sending account details to ${email}:`, accountDetails)

    await sendEmail({
      to: email,
      subject: 'Your Naira Account Details',
      html: `<p>Here are the Naira account details for your payment:</p><p><b>Account Name:</b> [Your Account Name]<br/><b>Account Number:</b> [Your Account Number]<br/><b>Bank Name:</b> [Your Bank Name]</p>`
    })

    return NextResponse.json(accountDetails)
  } catch (error) {
    console.error("Account details error:", error)
    return NextResponse.json({ error: "Failed to get account details" }, { status: 500 })
  }
}
