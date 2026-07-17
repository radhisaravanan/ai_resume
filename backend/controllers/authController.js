const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= 1. REGISTER CONTROLLER METHOD =================
exports.register = async (req, res) => {
  try {
    const { regno, password } = req.body;

    if (!regno || !/^\d+$/.test(regno.trim())) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Register Number must contain only numbers.",
        });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
    }

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE regno = ?",
      [regno.trim()],
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Registration number already registered.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO users (regno, password) VALUES (?, ?)", [
      regno.trim(),
      hashedPassword,
    ]);

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration Controller Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server registration failure.",
      });
  }
};

// ================= 2. LOGIN CONTROLLER METHOD =================
exports.login = async (req, res) => {
  try {
    const { regno, password } = req.body;

    if (!regno || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All identification parameters are required.",
        });
    }

    // Lookup user structure mapping entries inside active records pool
    const [users] = await db.execute("SELECT * FROM users WHERE regno = ?", [
      regno.trim(),
    ]);
    if (users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials setup data." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification password." });
    }

    // Generate runtime authorization token structures mapping payload variables
    const token = jwt.sign(
      { id: user.id, regno: user.regno },
      process.env.JWT_SECRET || "InterviewAI123",
      { expiresIn: "24h" },
    );

    return res.status(200).json({
      success: true,
      token,
      message: "Authentication mapping verified successfully!",
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal application login path runtime error.",
      });
  }
};
