const mysql = require("mysql2");
require("dotenv").config();

// Create a stable connection pool object compatible with local environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ai_interview",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Important: Controller operations use async await formats, export promise wrappers cleanly
module.exports = pool.promise();
