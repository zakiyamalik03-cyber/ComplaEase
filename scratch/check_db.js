
const mysql = require('mysql2/promise');

async function checkImages() {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "cms_db",
  });

  try {
    const [rows] = await connection.execute('SELECT id, name, image FROM users');
    console.log('User Images:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Image: "${row.image}"`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkImages();
