const db = require("../config/db");

// 1. Fully Synced Login Controller with Diagnostic Database Dumps
const login = async (req, res) => {
  const email = req.body.email ? req.body.email.trim() : "";
  const password = req.body.password;

  try {
    const query = "SELECT * FROM users WHERE TRIM(email) = ?";

    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("❌ Login Database Query Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database query error." });
      }

      console.log(
        `🔍 Login Scan - Matching rows found for [${email}]:`,
        results.length,
      );

      if (results.length === 0) {
        console.log(
          "⚠️ Email not found. Diagnostic mode: Printing all active table records below:",
        );

        // Diagnostic lookup to expose database synchronization issues
        db.query(
          "SELECT id, email, full_name FROM users",
          (allErr, allUsers) => {
            if (!allErr) {
              console.log(
                "📊 [DIAGNOSTIC DUMP] Users currently inside this database context:",
                allUsers,
              );
            } else {
              console.error(
                "❌ Diagnostic query failed. Table might be missing or corrupted:",
                allErr.message,
              );
            }
          },
        );

        return res.status(401).json({
          success: false,
          message:
            "Invalid Email. Account does not exist in the database record layers.",
        });
      }

      const user = results[0];

      // Structural password string matching check
      if (password !== user.password) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password." });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token: "mock_token_for_development",
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name || "User",
        },
      });
    });
  } catch (error) {
    console.error("Fatal catch login exception:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Database Field Constraint Aligned Registration Controller
const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const registrationName = name || "User";
  const registrationEmail = email ? email.trim() : "";

  try {
    const checkUser = "SELECT * FROM users WHERE TRIM(email) = ?";

    db.query(checkUser, [registrationEmail], (err, results) => {
      if (err) {
        console.error("❌ Registration duplicate pre-check failed:", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Registration validation query error.",
          });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists." });
      }

      // Explicitly uses full_name, matching structural fields verified by MySQL Workbench
      const insertSql = `
        INSERT INTO users (full_name, email, phone, password) 
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [registrationName, registrationEmail, phone || null, password],
        (insertErr, result) => {
          if (insertErr) {
            console.error(
              "❌ Registration SQL Write Failure:",
              insertErr.message,
            );
            return res.status(500).json({
              success: false,
              message: `Registration failed database storage: ${insertErr.message}`,
            });
          }

          console.log(
            `🎯 User successfully written to database row ID: ${result.insertId}`,
          );
          return res.status(201).json({
            success: true,
            message: "Registration successful!",
          });
        },
      );
    });
  } catch (error) {
    console.error("Fatal catch registration exception:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  register,
};
