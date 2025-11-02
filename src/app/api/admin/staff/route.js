import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password, role, phone, department } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  await db.execute(
    "INSERT INTO users (name, email, password, role, phone, department, created_at) VALUES (?,?,?,?,?,?, NOW())",
    [name, email, hashed, role, phone, department]
  );

  return Response.json({ message: "Staff/Manager/Admin added successfully" });
}