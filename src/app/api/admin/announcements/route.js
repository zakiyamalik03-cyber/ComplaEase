import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute(
      'SELECT id, title, message, created_by, created_at, updated_at FROM announcements ORDER BY created_at DESC'
    );

    const data = (rows || []).map((r) => ({
      id: r.id,
      title: r.title,
      message: r.message,
      created_by: String(r.created_by ?? ''),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : '',
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}
