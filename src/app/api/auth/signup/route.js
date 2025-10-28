import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();

  // check if user exists
  const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert new student (default role)
  await db.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?,?,?, 'student')",
    [name, email, hashedPassword]
  );

  return Response.json({ message: "User registered successfully" });
}
