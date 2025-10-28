import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",     // your XAMPP password (default empty)
  database: "cms_db",
});
