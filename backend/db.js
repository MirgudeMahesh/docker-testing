require("dotenv").config();
const mysql = require("mysql2");

// Create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise wrapper for async/await
const db = pool.promise();

// Test connection using promise-based pool
(async () => {
  try {
    const connection = await db.getConnection(); // ✅ use db, not pool
    console.log("✅ MySQL connected");
    connection.release();
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
})();

module.exports = db;