import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { fname, lname, email, password } = await req.json();

    if (!fname || !lname || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check existing user
    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length > 0) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert student record
    await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
      [`${fname} ${lname}`, email, hashedPassword]
    );

    return Response.json({ success: true, message: "Account created successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
