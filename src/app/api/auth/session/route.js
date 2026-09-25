import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const jwtSecret = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, jwtSecret);

    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
