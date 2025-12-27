import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

// Ensure the feedback table exists
async function ensureFeedbackTable() {
  try {
    // Attempt to create table without FK first to avoid type mismatch issues
    // We can add FK later or rely on application logic
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

    // Check if user_id column exists (since the user reported schema without it)
    try {
        await db.execute("SELECT user_id FROM feedback LIMIT 1");
    } catch (e) {
        // Column likely missing, add it
        console.log("Adding missing user_id column to feedback table...");
        await db.execute("ALTER TABLE feedback ADD COLUMN user_id INT NOT NULL DEFAULT 0");
    }

  } catch (e) {
    console.error("Ensure table error:", e);
    // Throwing here to ensure we know if table creation fails
    throw new Error(`Failed to ensure feedback table: ${e?.message || String(e)}`);
  }
}

function getAuthUserId(req) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const cookieHeader = req.headers.get("cookie") || req.headers.get("Cookie");
    
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

export async function POST(req) {
  try {
    await ensureFeedbackTable();
    const userId = getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const rawComplaint = body?.complaint_id;
    
    let complaintNumericId = null;
    const complaintStr = String(rawComplaint || "").trim();
    
    if (!complaintStr) {
        return NextResponse.json({ success: false, error: "Missing required field: complaint_id" }, { status: 400 });
    }

    // Try finding by public complaint_id string
    try {
        const [mapRows] = await db.execute("SELECT id FROM complaints WHERE complaint_id = ?", [complaintStr]);
        if (Array.isArray(mapRows) && mapRows.length > 0) {
            complaintNumericId = Number(mapRows[0].id);
        }
    } catch (e) {
        // Ignore column missing error, proceed to check by ID
        console.warn("Lookup by complaint_id column failed:", e.message);
    }

    if (!complaintNumericId && !Number.isNaN(Number(complaintStr))) {
        // Fallback: It might be a direct PK
        const pk = Number(complaintStr);
        const [pkRows] = await db.execute("SELECT id FROM complaints WHERE id = ?", [pk]);
        if (Array.isArray(pkRows) && pkRows.length > 0) {
            complaintNumericId = pk;
        }
    }

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
          complaint_id: complaintNumericId, // Internal ID
          public_complaint_id: rawComplaint, // Return what was sent
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

    let complaintNumericId = null;
    const complaintStr = String(rawComplaint).trim();

    // Try finding by public complaint_id string
    try {
        const [mapRows] = await db.execute("SELECT id FROM complaints WHERE complaint_id = ?", [complaintStr]);
        if (Array.isArray(mapRows) && mapRows.length > 0) {
            complaintNumericId = Number(mapRows[0].id);
        }
    } catch (e) {
        console.warn("Lookup by complaint_id column failed:", e.message);
    }

    if (!complaintNumericId && !Number.isNaN(Number(complaintStr))) {
        const pk = Number(complaintStr);
        const [pkRows] = await db.execute("SELECT id FROM complaints WHERE id = ?", [pk]);
        if (Array.isArray(pkRows) && pkRows.length > 0) {
            complaintNumericId = pk;
        }
    }

    if (!complaintNumericId) {
        return NextResponse.json({ success: false, error: "Complaint not found" }, { status: 404 });
    }

    // Join with users table to get commenter details
    const [rows] = await db.execute(
      `SELECT f.id, f.complaint_id, f.user_id, f.rating, f.comment, f.created_at,
              u.name as user_name, u.image as user_image, u.role as user_role
       FROM feedback f
       LEFT JOIN users u ON f.user_id = u.id
       WHERE f.complaint_id = ?
       ORDER BY f.created_at DESC`,
      [complaintNumericId]
    );

    return NextResponse.json({ success: true, data: rows || [] }, { status: 200 });
  } catch (error) {
    console.error("GET /api/complaints/feedback error:", error);
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
    if (feedback.user_id !== userId) {
         const [userRows] = await db.execute("SELECT role FROM users WHERE id = ?", [userId]);
         const role = userRows[0]?.role?.toLowerCase();
         if (role !== 'admin' && role !== 'administrator') {
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
