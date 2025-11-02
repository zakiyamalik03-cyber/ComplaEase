import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, role, phone, department, image, gender } = await req.json();
    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password, role, phone, department, image, gender, created_at) VALUES (?,?,?,?,?,?,?,?, NOW())",
      [name, email, hashed, role, phone, department, image, gender]
    );

    return Response.json({ message: "Staff/Manager/Admin added successfully" });
  } catch (error) {
    console.error("Error adding staff:", error);
    return Response.json({ message: "Failed to add staff: " + error.message }, { status: 500 });
  }
}