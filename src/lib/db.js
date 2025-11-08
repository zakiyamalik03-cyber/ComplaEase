import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "cms_db",
};

export async function getConnection() {
  try {
    return await mysql.createConnection(dbConfig);
  } catch (error) {
    console.error("Failed to create database connection:", error);
    if (process.env.NODE_ENV === "production") {
      return null;
    }
    throw error;
  }
}

export const db = {
  query: async (...args) => {
    const conn = await getConnection();
    if (!conn) return [];
    return conn.query(...args);
  },
  execute: async (...args) => {
    const conn = await getConnection();
    if (!conn) return [];
    return conn.execute(...args);
  },
};
