import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cms_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;
export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export const db = {
  query: async (...args) => {
    const p = getPool();
    return p.query(...args);
  },
  execute: async (...args) => {
    const p = getPool();
    return p.execute(...args);
  },
};
