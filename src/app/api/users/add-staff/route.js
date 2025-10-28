import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password, role } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  await db.execute("INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)", [
    name, email, hashed, role,
  ]);

  return Response.json({ message: "Staff/Manager/Admin added successfully" });
}
