import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const kycData = await request.json()

    // Upsert KYC details (update if exists, insert if not)
    const existing = await sql`SELECT id FROM kyc_details WHERE user_id = ${decoded.userId}`
    if (existing.length > 0) {
      await sql`
        UPDATE kyc_details SET
          residential_address = ${kycData.residentialAddress},
          school_name = ${kycData.schoolName},
          passport_number = ${kycData.passportNumber},
          student_id = ${kycData.studentId},
          purpose_of_use = ${kycData.purposeOfUse},
          photo_url = ${kycData.photoUrl},
          identity_card_url = ${kycData.identityCardUrl},
          student_id_url = ${kycData.studentIdUrl},
          status = 'submitted',
          created_at = NOW()
        WHERE user_id = ${decoded.userId}
      `
    } else {
      await sql`
        INSERT INTO kyc_details (
          user_id, residential_address, school_name, passport_number,
          student_id, purpose_of_use, photo_url, identity_card_url, student_id_url
        ) VALUES (
          ${decoded.userId}, ${kycData.residentialAddress}, ${kycData.schoolName},
          ${kycData.passportNumber}, ${kycData.studentId}, ${kycData.purposeOfUse},
          ${kycData.photoUrl}, ${kycData.identityCardUrl}, ${kycData.studentIdUrl}
        )
      `
    }

    // Update user KYC status
    await sql`
      UPDATE users SET kyc_status = 'submitted' WHERE id = ${decoded.userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("KYC submission error:", error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
