const mysql = require('mysql2');
require('dotenv').config();

console.log("Database file loaded…");   // Debug

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Kavitha123456789@',
  database: process.env.DB_NAME || 'question_paper_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// TEST DB CONNECTION
pool.getConnection((err, connection) => {
  if (err) {
    console.log(" Database connection FAILED:", err.message);
  } else {
    console.log("Database connected SUCCESSFULLY!");
    connection.release();
  }
});

module.exports = pool.promise();
