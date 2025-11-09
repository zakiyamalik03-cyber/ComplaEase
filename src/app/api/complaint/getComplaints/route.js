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
      return "Pending";
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
         c.complaint_id,
         c.title,
         c.description,
         c.category,
         c.priority,
         c.status,
         c.created_at,
         c.updated_at,
         c.image,
         c.assigned_to,
         c.created_by,
         u.name AS user_name,
         u.role AS user_role,
         u.department AS user_department,
         u.email AS user_email,
         COALESCE(u.image, '') AS user_image
       FROM complaints c
       LEFT JOIN users u ON u.id = c.created_by
       ORDER BY c.created_at DESC`
    );

    const placeholderImage = "/images/user/user-02.jpg";
    const complaints = (rows || []).map((r) => ({
      id: r.id,
      complaint_id: r.complaint_id || "",
      user: {
        image: r.user_image || placeholderImage,
        name: r.user_name || "Unknown",
        email: r.user_email || "",
        role: r.user_role || "",
        department: r.user_department || "",
      },
      description: r.description || "",
      category: r.category || "",
      subject: r.title || "",
      priority: toTitleCase(r.priority || ""),
      status: mapStatus(r.status || ""),
      image: r.image || null,
      assignedTo: r.assigned_to || "",
      created_by: String(r.created_by || ""),
      created_at: r.created_at ? new Date(r.created_at).toISOString() : "",
      updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : "",
    }));

    return NextResponse.json({ success: true, data: complaints }, { status: 200 });
  } catch (error) {
    console.error("GET /api/complaint/getComplaints error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch complaints" }, { status: 500 });
  }
}