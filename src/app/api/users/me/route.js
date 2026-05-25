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
      `SELECT u.id, u.name, u.email, r.name as role, u.phone, u.department, u.image, u.gender, u.bio, u.country, u.city, u.state, u.postal_code, u.tax_id
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`, 
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
        gender: user.gender || "",
        bio: user.bio || "",
        country: user.country || "",
        city: user.city || "",
        state: user.state || "",
        postal_code: user.postal_code || "",
        tax_id: user.tax_id || ""
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