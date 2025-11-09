import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Complaint ID is required" },
        { status: 400 }
      );
    }

    // Fetch complaint with user details
    const [complaint] = await db.execute(
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
        c.assigned_to,
        c.resolution_deadline,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.image as user_image,
        u.role as user_role,
        u.location as user_location
       FROM complaints c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.complaint_id = ?`,
      [id]
    );

    if (!complaint || complaint.length === 0) {
      return NextResponse.json(
        { success: false, message: "Complaint not found" },
        { status: 404 }
      );
    }

    const complaintData = complaint[0];

    // Format the response to match the UI requirements
    const formattedComplaint = {
      id: complaintData.id,
      complaint_id: complaintData.complaint_id,
      title: complaintData.title,
      description: complaintData.description,
      category: complaintData.category,
      priority: complaintData.priority,
      status: complaintData.status,
      created_at: complaintData.created_at,
      updated_at: complaintData.updated_at,
      assigned_to: complaintData.assigned_to,
      resolution_deadline: complaintData.resolution_deadline,
      user: {
        id: complaintData.user_id,
        name: complaintData.user_name,
        email: complaintData.user_email,
        image: complaintData.user_image || "/images/user/user-01.png",
        role: complaintData.user_role,
        location: complaintData.user_location
      }
    };

    return NextResponse.json({
      success: true,
      data: formattedComplaint
    });

  } catch (error) {
    console.error("Error fetching complaint:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}