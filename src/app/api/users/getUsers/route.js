import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ✅ using your MySQL connection

export async function GET() {
  try {
    // ✅ Query your MySQL table directly
    const [rows] = await db.query(`
      SELECT u.*, r.name as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      ORDER BY u.created_at DESC
    `);

    // ✅ Return data as JSON
    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
