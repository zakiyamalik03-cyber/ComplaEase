import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { analyzePriority } from "@/lib/ai";

export async function POST(req) {
  try {
    const body = await req.json();

    let {
      student_id,
      title,
      complaint_type_id,
      priority,
      description,
      status = "pending",
      created_by,
      assigned_to = null,
    } = body;

    // Auto-select priority if not provided or set to "Auto"
    if (!priority || priority === "Auto") {
      priority = await analyzePriority(title, description);
    }

    // Generate complaint_id (unique-ish) and set created_by to the student
    const complaint_id = `CMP-${Date.now()}`;
    const normalizedStatus = (status || "pending").toLowerCase();

    // Auto-assign to staff based on role associated with complaint type
    if (!assigned_to) {
      try {
        const [assigneeRows] = await db.execute(
          `SELECT u.id 
           FROM users u
           JOIN complaint_types ct ON u.role_id = ct.role_id
           LEFT JOIN complaints c ON u.id = c.assigned_to AND c.status != 'resolved'
           WHERE ct.id = ?
           GROUP BY u.id
           ORDER BY COUNT(c.id) ASC
           LIMIT 1`,
          [complaint_type_id]
        );
        
        if (Array.isArray(assigneeRows) && assigneeRows.length > 0) {
          assigned_to = assigneeRows[0].id;
          console.log(`Auto-assigned complaint ${complaint_id} to user ${assigned_to}`);
        }
      } catch (assignError) {
        console.error("Auto-assignment failed:", assignError);
        // Continue without assignment if it fails
      }
    }

    // Validate basic required fields
    if (!title || !complaint_type_id || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title, complaint_type_id, description" },
        { status: 400 }
      );
    }

    // Determine creator id: prefer provided created_by, else student_id
    const creatorSource = created_by ?? student_id;
    const createdByNum = Number(creatorSource);
    if (Number.isNaN(createdByNum)) {
      return NextResponse.json(
        { error: "Invalid created_by/student_id: must be a numeric user id" },
        { status: 400 }
      );
    }

    // Verify the user exists to satisfy FK constraint
    const [userRows] = await db.execute("SELECT id FROM users WHERE id = ?", [createdByNum]);
    if (!Array.isArray(userRows) || userRows.length === 0) {
      return NextResponse.json(
        { error: "User not found for provided created_by/student_id" },
        { status: 400 }
      );
    }

    // Perform insert (omit auto-increment id; set timestamps in DB)
    const [result] = await db.execute(
      `INSERT INTO complaints (complaint_id, title, complaint_type_id, priority, description, status, created_by, assigned_to, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        complaint_id,
        title,
        complaint_type_id,
        priority,
        description,
        normalizedStatus,
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
