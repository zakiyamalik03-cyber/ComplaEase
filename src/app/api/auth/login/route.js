import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return Response.json({ error: "All fields required" }, { status: 400 });

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) return Response.json({ error: "Invalid email" }, { status: 400 });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return Response.json({ error: "Invalid password" }, { status: 400 });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return Response.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
