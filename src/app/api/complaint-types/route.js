import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT id, name FROM complaint_types ORDER BY name ASC");
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/complaint-types error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch complaint types" }, { status: 500 });
  }
}
