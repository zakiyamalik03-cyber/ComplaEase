import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request) {
  try {
    const body = await request.json();

    // Destructure the required fields from the request body
    const {
      complaint_id,
      student_id,
      title,
      category,
      description,
      status = 'pending', 
      image = null,
      created_by,
      assigned_to = null,
    } = body;

    // Validate required fields
    if (!complaint_id || !student_id || !title || !category || !description || !created_by) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'complaint_management',
    });

    // Insert the new complaint into the complaints table
    const [result] = await connection.execute(
      `INSERT INTO complaints (id, complaint_id, student_id, title, category, description, status, image, created_by, assigned_to, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        null, // id is auto-incremented
        complaint_id,
        student_id,
        title,
        category,
        description,
        status,
        image,
        created_by,
        assigned_to,
      ]
    );

    await connection.end();

    return NextResponse.json({ message: 'Complaint posted successfully', insertId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error posting complaint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
