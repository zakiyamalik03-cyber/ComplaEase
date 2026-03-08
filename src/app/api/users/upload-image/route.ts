import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `user-${userId}-${uuidv4()}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), "public/images/user");
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicPath = `/images/user/${filename}`;

    // Update DB
    await db.execute("UPDATE users SET image = ? WHERE id = ?", [publicPath, userId]);

    return NextResponse.json({ success: true, image: publicPath });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
