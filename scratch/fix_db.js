
const mysql = require('mysql2/promise');

async function fixImages() {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "cms_db",
  });

  try {
    const [result] = await connection.execute('UPDATE users SET image = NULL WHERE image = "img"');
    console.log(`Updated ${result.affectedRows} users.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

fixImages();
