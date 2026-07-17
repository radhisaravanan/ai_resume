const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =======================
// Register API
// =======================
exports.register = async (req, res) => {
  const { full_name, regno, phone, college, password } = req.body;

  if (!full_name || !regno || !phone || !college || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE regno = ?",
      [regno],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        if (result.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Register Number already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
          INSERT INTO users
          (full_name, regno, phone, college, password)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
          sql,
          [full_name, regno, phone, college, hashedPassword],
          (err, data) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            return res.status(201).json({
              success: true,
              message: "Registration Successful",
              userId: data.insertId,
            });
          },
        );
      },
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Login API
// =======================
exports.login = (req, res) => {
  const { regno, password } = req.body;

  if (!regno || !password) {
    return res.status(400).json({
      success: false,
      message: "Register Number and Password are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE regno = ?",
    [regno],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid Register Number",
        });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          regno: user.regno,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          regno: user.regno,
          phone: user.phone,
          college: user.college,
          role: user.role,
        },
      });
    },
  );
};
