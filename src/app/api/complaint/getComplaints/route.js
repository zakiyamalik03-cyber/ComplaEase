import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function toTitleCase(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function mapStatus(status) {
  if (!status) return "";
  const s = String(status).toLowerCase();
  switch (s) {
    case "pending":
    case "open":
      return "Open";
    case "in_progress":
    case "in progress":
      return "In Progress";
    case "resolved":
    case "closed":
      return "Resolved";
    default:
      return toTitleCase(s);
  }
}

export async function GET() {
  try {
    const [rows] = await db.execute(
      `SELECT 
         c.id,
         c.title,
         c.category,
         c.priority,
         c.status,
         c.created_at,
         u.name AS user_name,
         u.email AS user_email,
         COALESCE(u.image, '') AS user_image
       FROM complaints c
       LEFT JOIN users u ON u.id = c.created_by
       ORDER BY c.created_at DESC`
    );

    const placeholderImage = "/images/user/user-02.jpg";
    const complaints = (rows || []).map((r) => ({
      id: r.id,
      user: {
        image: r.user_image || placeholderImage,
        name: r.user_name || "Unknown",
        email: r.user_email || "",
      },
      category: r.category || "",
      subject: r.title || "",
      priority: toTitleCase(r.priority || ""),
      status: mapStatus(r.status || ""),
      date: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : "",
    }));

    return NextResponse.json({ success: true, data: complaints }, { status: 200 });
  } catch (error) {
    console.error("GET /api/complaint/getComplaints error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch complaints" }, { status: 500 });
  }
}