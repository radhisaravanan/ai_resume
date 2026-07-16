const db = require("../config/db");

// Find user by Register Number
exports.findUserByRegNo = (regno, callback) => {
  const sql = "SELECT * FROM users WHERE regno = ?";
  db.query(sql, [regno], callback);
};

// Create new user
exports.createUser = (
  full_name,
  regno,
  phone,
  college,
  password,
  callback
) => {
  const sql = `
    INSERT INTO users (full_name, regno, phone, college, password)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [full_name, regno, phone, college, password], callback);
};