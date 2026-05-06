import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

// Ensure the feedback table exists
// This runs once per request if called, but realistically should be a migration.
// Keeping it light for now.
async function ensureFeedbackTable() {
  try {
    // Basic table check
    await db.execute(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        complaint_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure user_id column exists (in case table was created with an old schema)
    try {
      const [columns] = await db.execute("SHOW COLUMNS FROM feedback LIKE 'user_id'");
      if (Array.isArray(columns) && columns.length === 0) {
        console.log("Adding missing user_id column to feedback table...");
        await db.execute("ALTER TABLE feedback ADD COLUMN user_id INT NOT NULL AFTER complaint_id");
      }
    } catch (columnError) {
      console.error("Error checking/adding user_id column:", columnError);
    }
  } catch (e) {
    console.error("Ensure table error:", e);
  }
}

// Helper: Extract user ID from token
function getAuthUserId(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie");
    
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (cookieHeader) {
       const cookiesObj = cookieHeader
        .split(/;\s*/)
        .map((kv) => kv.split("="))
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
       token = cookiesObj?.token || cookiesObj?.["auth-token"];
    }
    
    if (!token) return null;
    
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);
    const id = decoded?.id || decoded?.userId || decoded?.user?.id;
    return typeof id !== "undefined" ? Number(id) : null;
  } catch (e) {
    return null;
  }
}

// Helper: Resolve complaint_id (string or int) to numeric PK
async function resolveComplaintId(rawId) {
    const strId = String(rawId || "").trim();
    if (!strId) return null;

    // 1. Try finding by public 'complaint_id' column (e.g. 'CMP-123')
    try {
        const [rows] = await db.execute("SELECT id FROM complaints WHERE complaint_id = ?", [strId]);
        if (Array.isArray(rows) && rows.length > 0) {
            return Number(rows[0].id);
        }
    } catch (e) {
        // Ignore if column doesn't exist
    }

    // 2. Fallback: If it looks like a number, try PK lookup
    if (!Number.isNaN(Number(strId))) {
        const pk = Number(strId);
        const [rows] = await db.execute("SELECT id FROM complaints WHERE id = ?", [pk]);
        if (Array.isArray(rows) && rows.length > 0) {
            return pk;
        }
    }

    return null;
}

export async function POST(req) {
  try {
    // Only ensure table on POST (creation), READ/DELETE assume it exists or fail gracefully
    await ensureFeedbackTable();
    
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const complaintNumericId = await resolveComplaintId(body?.complaint_id);

    if (!complaintNumericId) {
        return NextResponse.json({ success: false, error: "Complaint not found" }, { status: 404 });
    }

    const comment = String(body?.comment || "").trim();
    const ratingNum = Number(body?.rating);
    const rating = Number.isFinite(ratingNum) ? Math.max(1, Math.min(5, ratingNum)) : null;

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Missing required field: comment" },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      `INSERT INTO feedback (complaint_id, user_id, rating, comment, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [complaintNumericId, userId, rating, comment]
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result?.insertId,
          complaint_id: complaintNumericId,
          user_id: userId,
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
        message: "Feedback posted",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/complaints/feedback error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", details: error?.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await ensureFeedbackTable();
    const { searchParams } = new URL(req.url);
    const rawComplaint = searchParams.get("complaint_id");
    
    if (!rawComplaint) {
      return NextResponse.json(
        { success: false, error: "Missing required query: complaint_id" },
        { status: 400 }
      );
    }

    const complaintNumericId = await resolveComplaintId(rawComplaint);

    if (!complaintNumericId) {
        return NextResponse.json({ success: false, error: "Complaint not found" }, { status: 404 });
    }

    // Join with users table to get commenter details
    const [rows] = await db.execute(
      `SELECT f.id, f.complaint_id, f.user_id, f.rating, f.comment, f.created_at,
              u.name as user_name, u.image as user_image, r.name as user_role
       FROM feedback f
       LEFT JOIN users u ON f.user_id = u.id
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE f.complaint_id = ?
       ORDER BY f.created_at DESC`,
      [complaintNumericId]
    );

    return NextResponse.json({ success: true, data: rows || [] }, { status: 200 });
  } catch (error) {
    console.error("GET /api/complaints/feedback error:", error);
    // If table doesn't exist yet, return empty list instead of error
    if (error?.code === 'ER_NO_SUCH_TABLE') {
        return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }
    return NextResponse.json({ success: false, error: "Internal server error", details: error?.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const feedbackId = searchParams.get("id");

    if (!feedbackId) {
      return NextResponse.json({ success: false, error: "Missing feedback id" }, { status: 400 });
    }

    const [rows] = await db.execute("SELECT user_id FROM feedback WHERE id = ?", [feedbackId]);
    
    if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ success: false, error: "Feedback not found" }, { status: 404 });
    }

    const feedback = rows[0];
    
    // Authorization: Allow if owner OR admin
    if (feedback.user_id !== userId) {
         const [userRows] = await db.execute(
           `SELECT r.name as role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = ?`, 
           [userId]
         );
         const role = (userRows[0]?.role || "").toLowerCase();
         const isManager = role === 'admin' || role === 'administrator' || role === 'manager';
         
         if (!isManager) {
             return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
         }
    }

    await db.execute("DELETE FROM feedback WHERE id = ?", [feedbackId]);

    return NextResponse.json({ success: true, message: "Feedback deleted" }, { status: 200 });

  } catch (error) {
    console.error("DELETE /api/complaints/feedback error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", details: error?.message }, { status: 500 });
  }
}
