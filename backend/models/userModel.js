const db = require("../config/db");

// Find user by email
exports.findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

// Create new user
exports.createUser = (full_name, email, password, callback) => {
  const sql = `
        INSERT INTO users(full_name,email,password)
        VALUES(?,?,?)
    `;

  db.query(sql, [full_name, email, password], callback);
};
