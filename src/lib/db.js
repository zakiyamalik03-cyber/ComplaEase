import mysql from "mysql2/promise";

// Create a connection pool instead of a single connection
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",     // your XAMPP password (default empty)
  database: "cms_db",
};

// Function to get a connection from the pool
export async function getConnection() {
  try {
    return await mysql.createConnection(dbConfig);
  } catch (error) {
    console.error('Failed to create database connection:', error);
    // Return null if in production build
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    throw error;
  }
}

// For backward compatibility
export const db = { 
  query: async (...args) => {
    const conn = await getConnection();
    if (!conn) return []; // Return empty result if no connection
    return conn.query(...args);
  },
  execute: async (...args) => {
    const conn = await getConnection();
    if (!conn) return []; // Return empty result if no connection
    return conn.execute(...args);
  }
};
