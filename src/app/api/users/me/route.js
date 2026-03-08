import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Get token from authorization header or cookie
    const authHeader = req.headers.get('authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Try to get token from cookies
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        
        token = cookies['token'] || cookies['auth-token'];
      }
    }

    if (!token) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Get user data from database
    const [rows] = await db.execute(
      "SELECT id, name, email, role, phone, department, image, gender FROM users WHERE id = ?", 
      [userId]
    );

    if (rows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        department: user.department || "",
        image: user.image || "",
        gender: user.gender || ""
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}