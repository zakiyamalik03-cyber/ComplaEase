import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      student_id,
      title,
      category,
      priority = "low",
      description,
      status = "pending",
      image = null,
      assigned_to = null,
    } = body;

    // Generate complaint_id (unique-ish) and set created_by to the student
    const complaint_id = body.complaint_id || `CMP-${Date.now()}`;
    const created_by = student_id;
    const normalizedStatus = (status || "pending").toLowerCase();

    // Validate basic required fields
    if (!student_id || !title || !category || !description) {
      return NextResponse.json(
        { error: "Missing required fields: student_id, title, category, description" },
        { status: 400 }
      );
    }

    // Coerce IDs to numbers if users.id is numeric (common schema)
    const studentIdNum = Number(student_id);
    const createdByNum = Number(created_by);
    if (Number.isNaN(studentIdNum) || Number.isNaN(createdByNum)) {
      return NextResponse.json(
        { error: "Invalid student_id: must be a numeric user id" },
        { status: 400 }
      );
    }

    // Verify user exists to satisfy FK constraints
    const [userRows] = await db.execute("SELECT id FROM users WHERE id = ?", [createdByNum]);
    if (!Array.isArray(userRows) || userRows.length === 0) {
      return NextResponse.json(
        { error: "User not found for provided student_id" },
        { status: 400 }
      );
    }

    // Perform insert (omit auto-increment id; set timestamps in DB)
    const [result] = await db.execute(
      `INSERT INTO complaints (complaint_id, student_id, title, category, priority, description, status, image, created_by, assigned_to, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        complaint_id,
        studentIdNum,
        title,
        category,
        priority,
        description,
        normalizedStatus,
        image,
        createdByNum,
        assigned_to,
      ]
    );

    return NextResponse.json(
      { message: "Complaint added successfully", complaint_id, insertId: result?.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding complaint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}