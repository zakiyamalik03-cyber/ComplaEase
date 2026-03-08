import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(req: Request) {
  try {
    // Auth Check
    const authHeader = req.headers.get("authorization");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc: any, cookie) => {
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

    // Verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.id;

    // Get current image
    const [rows]: any = await db.execute("SELECT image FROM users WHERE id = ?", [userId]);
    const user = rows[0];

    if (user?.image) {
      const oldImageName = path.basename(user.image);
      // Avoid deleting default assets if they are named specifically, but generic check:
      // If it looks like a user upload (we used uuid), delete it.
      // Or simply, if it is in the user folder and NOT one of the protected defaults.
      const protectedFiles = ["male.jpg", "female.jpg", "user-01.jpg", "user-02.jpg"]; // Add others if needed
      
      if (!protectedFiles.includes(oldImageName)) {
         const filePath = path.join(process.cwd(), "public", user.image);
         try {
             await unlink(filePath);
         } catch (e) {
             console.warn("Failed to delete file:", filePath, e);
             // Continue to update DB even if file delete fails (maybe file missing)
         }
      }
    }

    // Update DB
    await db.execute("UPDATE users SET image = NULL WHERE id = ?", [userId]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
