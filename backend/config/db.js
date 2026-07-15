// backend/config/db.js
const mysql = require("mysql2");

// Load .env variables manually in case they aren't loaded globally yet
require("dotenv").config();

// Create a connection pool instead of a single connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD, // Automatically grabs your updated .env password
  database: process.env.DB_NAME || "ai_interview",
  waitForConnections: true,
  connectionLimit: 10, // Keeps up to 10 connection channels open dynamically
  queueLimit: 0,
});

// Test the pool connectivity on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Pool Failed!");
    console.error("Error Message:", err.message);
  } else {
    console.log("✅ MySQL Database Pool Connected and Ready!");
    connection.release(); // Return the connection back to the pool instantly
  }
});

module.exports = db;
