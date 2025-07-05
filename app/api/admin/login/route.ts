import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { email, pin } = await request.json();
  // Check for admin with exact email and pin (plain, not hashed)
  const result = await sql`
    SELECT * FROM admins WHERE email = ${email} AND pin = ${pin} LIMIT 1
  `;
  if (result.length === 1) {
    // Set a simple session cookie (not secure, for demo only)
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", "1", { path: "/", httpOnly: true });
    return response;
  } else {
    return NextResponse.json({ error: "Invalid email or pin" }, { status: 401 });
  }
} 