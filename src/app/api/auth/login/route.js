import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

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

  return Response.json({ token, user });
}
