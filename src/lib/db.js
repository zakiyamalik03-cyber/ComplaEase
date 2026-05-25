import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "cms_db",
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
