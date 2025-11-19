import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Update current authenticated user's profile fields
export async function PATCH(req) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.get("authorization");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {});
        token = cookies["token"] || cookies["auth-token"];
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify JWT and get user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Parse body and pick allowed fields for update
    const body = await req.json();
    const allowed = ["name", "email", "phone", "department", "image", "gender"];
    const updates = Object.entries(body).filter(([k, v]) => allowed.includes(k));

    if (updates.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Build dynamic SET clause
    const setClause = updates.map(([k]) => `${k} = ?`).join(", ");
    const values = updates.map(([, v]) => v);

    const [result] = await db.execute(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, userId]
    );

    if (!result || result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found or no changes" }, { status: 404 });
    }

    // Return latest user data
    const [rows] = await db.execute(
      "SELECT id, name, email, role, phone, department, image, gender FROM users WHERE id = ?",
      [userId]
    );

    const user = rows?.[0];
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        department: user.department || "",
        image: user.image || "",
        gender: user.gender || "",
      },
    });
  } catch (error) {
    console.error("PATCH /api/users/update error:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error", details: error?.message }, { status: 500 });
  }
}